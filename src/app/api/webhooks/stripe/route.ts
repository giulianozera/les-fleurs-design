import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { orderConfirmationHtml, orderAdminHtml } from '@/lib/emails';
import { createShippingLabel, trackingUrl, type LabelResult } from '@/lib/shipping';
import { signOrderAction } from '@/lib/orderToken';
import { decrementStock } from '@/sanity/queries';

export const runtime = 'nodejs';
export const maxDuration = 60;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

type OrderItemPayload = {
  productId: string;
  title: string;
  colorName?: string | null;
  potName?: string | null;
  quantity: number;
  price: number;
  imageUrl?: string | null;
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return new Response('Stripe not configured', { status: 503 });

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return new Response('Missing stripe-signature or webhook secret', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = await stripe.checkout.sessions.retrieve(
      (event.data.object as Stripe.Checkout.Session).id,
    );

    const supabaseCheck = getSupabaseAdminClient();
    if (supabaseCheck) {
      const { data: existing } = await supabaseCheck
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle();
      if (existing) {
        return new Response(null, { status: 200 });
      }
    }

    // Prefer the shipping recipient name (always collected with the shipping
    // address); fall back to the billing name. The old code only read the
    // billing name, which is often empty → orders arrived with just an email.
    const shippingName = session.collected_information?.shipping_details?.name ?? null;
    const customerName = shippingName ?? session.customer_details?.name ?? null;
    const customerEmail = session.customer_details?.email;
    const addr = session.collected_information?.shipping_details?.address ?? null;
    let items: OrderItemPayload[] = [];
    try {
      items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
    } catch (err) {
      console.error('[webhook] bad metadata.items', session.id, err);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lesfleursdesign.com';

    // ── 1. Save order to Supabase ─────────────────────────────────────────────
    let orderId: string | null = null;
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data: order } = await supabase
          .from('orders')
          .insert({
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string | null,
            customer_email: customerEmail ?? '',
            customer_name: customerName,
            shipping_address: addr ?? null,
            subtotal_cents: session.amount_subtotal ?? 0,
            shipping_cents: session.total_details?.amount_shipping ?? 0,
            total_cents: session.amount_total ?? 0,
            status: 'paid',
          })
          .select('id')
          .single();

        if (order) {
          orderId = order.id;
          await supabase.from('order_items').insert(
            items.map((item) => ({
              order_id: order.id,
              product_id: item.productId,
              product_title: item.title,
              color_name: item.colorName ?? null,
              pot_name: item.potName ?? null,
              quantity: item.quantity,
              unit_price_cents: Math.round(item.price * 100),
              image_url: item.imageUrl ?? null,
            })),
          );
        }
      }
    } catch (err) {
      console.error('Supabase insert error:', err);
    }

    // ── 2. Decrement stock in Sanity ──────────────────────────────────────────
    try {
      await decrementStock(
        items
          .filter((i) => i.productId)
          .map((i) => ({ productId: i.productId, quantity: i.quantity })),
      );
    } catch (err) {
      console.error('Stock decrement error:', err);
    }

    // ── 3. Buy the shipping label so the order can be fulfilled ────────────────
    let label: LabelResult | null = null;
    if (addr?.line1 && addr.city && addr.state && addr.postal_code) {
      try {
        label = await createShippingLabel({
          toName: customerName ?? 'Customer',
          toStreet1: addr.line1,
          toCity: addr.city,
          toState: addr.state,
          toZip: addr.postal_code,
          toCountry: addr.country ?? 'US',
        });
        if (!label) {
          console.error('[webhook] createShippingLabel returned null (EASYPOST_API_KEY?)', session.id);
        }
      } catch (err) {
        console.error('EasyPost label error:', err);
      }
    } else {
      console.error('[webhook] no shipping address on session — label skipped', session.id);
    }

    // ── 3b. Persist label + tracking on the order (survives a missed email) ────
    if (label && orderId) {
      try {
        const supabase = getSupabaseAdminClient();
        await supabase
          ?.from('orders')
          .update({
            tracking_code: label.trackingCode || null,
            label_url: label.labelUrl || null,
            carrier: label.carrier || null,
          })
          .eq('id', orderId);
      } catch (err) {
        console.error('[webhook] persist label error', err);
      }
    }

    // ── 4. Emails: customer confirmation (with tracking) + admin notification ──
    if (customerEmail) {
      const track = label ? trackingUrl(label.carrier, label.trackingCode) : null;
      const shipToken = orderId ? signOrderAction(orderId) : null;
      const shipUrl =
        orderId && shipToken
          ? `${siteUrl}/admin/ship?order=${orderId}&token=${shipToken}`
          : null;

      const emailData = {
        customerName: customerName ?? '',
        customerEmail,
        customerPhone: session.customer_details?.phone ?? null,
        items,
        totalCents: session.amount_total ?? 0,
        shippingAddress: addr,
        label: label ?? undefined,
        trackingUrl: track,
      };

      try {
        await Promise.all([
          sendEmail({
            to: customerEmail,
            subject: 'Your Les Fleurs Design order is confirmed',
            html: orderConfirmationHtml(emailData),
          }),
          sendEmail({
            to: ADMIN,
            subject: `New order — ${customerName || customerEmail}`,
            html: orderAdminHtml({ ...emailData, shipUrl }),
          }),
        ]);
      } catch (err) {
        console.error('Email send error:', err);
      }
    }
  }

  return new Response(null, { status: 200 });
}

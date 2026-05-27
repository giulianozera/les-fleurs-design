import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { orderConfirmationHtml, orderAdminHtml } from '@/lib/emails';
import { createShippingLabel } from '@/lib/shipping';

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

    const customerEmail = session.customer_details?.email;
    const addr = session.collected_information?.shipping_details?.address ?? null;
    const items: OrderItemPayload[] = session.metadata?.items
      ? JSON.parse(session.metadata.items)
      : [];

    // ── 1. Save order to Supabase ─────────────────────────────────────────────
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data: order } = await supabase
          .from('orders')
          .insert({
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string | null,
            customer_email: customerEmail ?? '',
            customer_name: session.customer_details?.name ?? null,
            shipping_address: addr ?? null,
            subtotal_cents: session.amount_subtotal ?? 0,
            shipping_cents: session.total_details?.amount_shipping ?? 0,
            total_cents: session.amount_total ?? 0,
            status: 'paid',
          })
          .select('id')
          .single();

        if (order) {
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

    // ── 2. Send confirmation emails ───────────────────────────────────────────
    if (customerEmail) {
      const emailData = {
        customerName: session.customer_details?.name ?? '',
        customerEmail,
        customerPhone: session.customer_details?.phone ?? null,
        items,
        totalCents: session.amount_total ?? 0,
        shippingAddress: addr,
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
            subject: `New order — ${customerEmail}`,
            html: orderAdminHtml(emailData),
          }),
        ]);
      } catch (err) {
        console.error('Email send error:', err);
      }

      // ── 3. Generate shipping label → follow-up admin email ──────────────────
      if (addr?.line1 && addr.city && addr.state && addr.postal_code) {
        try {
          const label = await createShippingLabel({
            toName: session.customer_details?.name ?? 'Customer',
            toStreet1: addr.line1,
            toCity: addr.city,
            toState: addr.state,
            toZip: addr.postal_code,
            toCountry: addr.country ?? 'US',
          });
          if (label) {
            await sendEmail({
              to: ADMIN,
              subject: `Shipping label ready — ${customerEmail}`,
              html: orderAdminHtml({ ...emailData, label }),
            });
          }
        } catch (err) {
          console.error('EasyPost label error:', err);
        }
      }
    }
  }

  return new Response(null, { status: 200 });
}

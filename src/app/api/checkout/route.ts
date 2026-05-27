import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/store/cartStore';
import { getShippingRates, toStripeShippingOptions } from '@/lib/shipping';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  let items: CartItem[];
  try {
    const body = await req.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0) throw new Error();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingRates = await getShippingRates('00000', 500, subtotal);
  const shippingOptions = toStripeShippingOptions(shippingRates);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description:
            [item.colorName, item.potName].filter(Boolean).join(' · ') || undefined,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    shipping_address_collection: { allowed_countries: ['US'] },
    phone_number_collection: { enabled: true },
    shipping_options: shippingOptions,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
    metadata: {
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          title: i.title,
          colorName: i.colorName ?? null,
          potName: i.potName ?? null,
          quantity: i.quantity,
          price: i.price,
          imageUrl: i.imageUrl,
        })),
      ),
    },
  });

  return Response.json({ url: session.url });
}

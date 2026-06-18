import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/store/cartStore';
import { getShippingRates, toStripeShippingOptions } from '@/lib/shipping';
import { getProductById } from '@/sanity/queries';

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
  let termsAccepted: unknown;
  try {
    const body = await req.json();
    items = body.items;
    termsAccepted = body.termsAccepted;
    if (!Array.isArray(items) || items.length === 0) throw new Error();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Gate checkout on explicit Terms of Service consent. The cart sends
  // { items, termsAccepted: true }; reject anything that isn't strictly true.
  if (termsAccepted !== true) {
    return Response.json(
      { error: 'You must accept the Terms of Service to checkout' },
      { status: 400 },
    );
  }

  for (const item of items) {
    if (
      typeof item.productId !== 'string' ||
      !item.productId.trim() ||
      typeof item.title !== 'string' ||
      !item.title.trim() ||
      !Number.isFinite(item.price) ||
      item.price <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > 99
    ) {
      return Response.json({ error: 'Invalid cart item' }, { status: 400 });
    }
  }

  // SECURITY: never trust the client-supplied item.price. Re-fetch every cart
  // line from Sanity by its productId and charge the authoritative basePrice.
  // A tampered price in the request body therefore cannot change the charge.
  const authoritativeProducts = await Promise.all(
    items.map((item) => getProductById(item.productId)),
  );

  // Pair each cart line with its authoritative Sanity product, rejecting any
  // line whose product no longer exists, is out of stock, or has an invalid
  // server-side price.
  const pricedItems: { item: CartItem; basePrice: number; title: string }[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const product = authoritativeProducts[i];

    if (!product) {
      return Response.json(
        { error: 'One or more items are no longer available' },
        { status: 400 },
      );
    }

    if (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0) {
      return Response.json(
        { error: 'One or more items are out of stock' },
        { status: 400 },
      );
    }

    if (!Number.isFinite(product.basePrice) || product.basePrice <= 0) {
      return Response.json(
        { error: 'One or more items are no longer available' },
        { status: 400 },
      );
    }

    pricedItems.push({ item, basePrice: product.basePrice, title: product.title });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  // Subtotal is computed from authoritative prices, not the client's.
  const subtotal = pricedItems.reduce(
    (sum, { basePrice, item }) => sum + basePrice * item.quantity,
    0,
  );

  // Record the server-side time of consent as an ISO-8601 string. Stamped at
  // request time so it reflects when the customer actually accepted the Terms.
  const consentAt = new Date().toISOString();

  try {
    const shippingRates = await getShippingRates('00000', 500, subtotal);
    const shippingOptions = toStripeShippingOptions(shippingRates);

    const session = await stripe.checkout.sessions.create({
      // No payment_method_types — omitting it enables Stripe dynamic payment
      // methods, which surfaces Apple Pay, Google Pay and Link (the wallets that
      // pull cards saved on the customer's phone) based on the device + the
      // methods enabled in the Stripe Dashboard.
      mode: 'payment',
      // automatic_tax requires a collected customer address; billing_address_
      // collection: 'required' + the shipping collection below satisfy that.
      // TODO: Stripe Tax must be enabled in the Dashboard and sales-tax
      // registrations completed per-state (FL + economic-nexus states) with an
      // accountant — code enables collection only.
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      line_items: pricedItems.map(({ item, basePrice, title }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            // Authoritative title from Sanity (not the client's).
            name: title,
            description:
              [item.colorName, item.potName].filter(Boolean).join(' · ') || undefined,
            // Client image is display-only and never affects the charge.
            images: item.imageUrl ? [item.imageUrl] : [],
            // TODO: confirm txcd_99999999 is the correct Stripe tax category
            // for the products. (txcd_99999999 = general tangible goods.)
            tax_code: 'txcd_99999999',
          },
          // Charge the authoritative Sanity basePrice — item.price is ignored.
          unit_amount: Math.round(basePrice * 100),
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: true },
      // Require an apartment / suite / unit so packages aren't undeliverable.
      // Stripe's address "line 2" is always optional and can't be forced, so we
      // collect it as a REQUIRED custom field; single-family homes enter "N/A".
      // The webhook normalizes the value and writes it to the shipping label.
      custom_fields: [
        {
          key: 'apartment',
          label: { type: 'custom', custom: 'Apartment / suite / unit (type N/A if none)' },
          type: 'text',
          optional: false,
          text: { maximum_length: 100 },
        },
      ],
      shipping_options: shippingOptions,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        items: JSON.stringify(
          pricedItems.map(({ item, basePrice, title }) => ({
            productId: item.productId,
            // Store the authoritative title + price so the order record and
            // webhook reflect exactly what Stripe charged.
            title,
            colorName: item.colorName ?? null,
            potName: item.potName ?? null,
            quantity: item.quantity,
            price: basePrice,
          })),
        ),
        termsAccepted: 'true',
        termsAcceptedAt: consentAt,
      },
    });

    if (!session.url) {
      console.error('[checkout] session created without url', session.id);
      return Response.json(
        { error: 'Unable to start checkout. Please try again.' },
        { status: 502 },
      );
    }

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] session create failed', err);
    return Response.json(
      { error: 'Unable to start checkout. Please try again.' },
      { status: 502 },
    );
  }
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Stripe from 'stripe';

export const metadata: Metadata = { title: 'Order Confirmed — Les Fleurs Design' };

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerName: string | null = null;
  let customerEmail: string | null = null;

  if (session_id) {
    try {
      const stripe = getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ['line_items'],
        });
        customerName = session.customer_details?.name ?? null;
        customerEmail = session.customer_details?.email ?? null;
      }
    } catch {
      // Session lookup is best-effort; page still renders without it
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">
        {/* Decorative mark */}
        <div className="w-12 h-px bg-gold mx-auto mb-10" />

        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-4">
          {customerName ? `Thank you, ${customerName.split(' ')[0]}.` : 'Thank you.'}
        </h1>

        <p className="font-body text-sm text-warm-gray leading-[1.8] mb-8">
          {customerEmail
            ? `Your order is confirmed. A receipt has been sent to ${customerEmail}.`
            : 'Your order is confirmed and a receipt has been sent to your email.'}
          <br />
          Your roses will be prepared with care and shipped within 2–3 business days.
        </p>

        <div className="w-full h-px bg-charcoal/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="label-caps border border-charcoal text-charcoal px-8 py-3 hover:bg-charcoal hover:text-ivory transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="label-caps text-warm-gray hover:text-charcoal transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <p className="font-body text-xs text-charcoal/30 mt-12">
          Questions? Email us at hello@lesfleursdesign.com
        </p>
      </div>
    </div>
  );
}

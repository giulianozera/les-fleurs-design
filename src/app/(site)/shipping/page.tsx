import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Returns — Les Fleurs Design',
  description: 'Shipping rates, delivery times, and return policy for Les Fleurs Design.',
};

const RATES = [
  {
    name: 'Standard Shipping',
    carrier: 'UPS Ground',
    price: '$12',
    time: '5–7 business days',
    note: 'Free on orders over $200',
  },
  {
    name: 'Express Shipping',
    carrier: 'UPS 2nd Day Air',
    price: '$25',
    time: '2–3 business days',
    note: null,
  },
];

export default function ShippingPage() {
  return (
    <div className="bg-ivory pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="label-caps text-warm-gray mb-5">Shipping & Returns</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-16">
            Delivery Details.
          </h1>

          {/* Processing */}
          <section className="mb-16">
            <h2 className="label-caps text-charcoal mb-6">Processing Time</h2>
            <div className="w-full h-px bg-charcoal/10 mb-6" />
            <p className="font-body text-sm text-warm-gray leading-[1.9]">
              All orders are prepared and dispatched from our Miami, FL studio within <strong className="text-charcoal font-medium">2–3 business days</strong> of payment confirmation. You will receive an email with your UPS tracking number once your order ships.
            </p>
          </section>

          {/* Rates table */}
          <section className="mb-16">
            <h2 className="label-caps text-charcoal mb-6">Shipping Rates</h2>
            <div className="w-full h-px bg-charcoal/10 mb-6" />
            <div className="flex flex-col divide-y divide-charcoal/10">
              {RATES.map((rate) => (
                <div key={rate.name} className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">{rate.name}</p>
                    <p className="font-body text-xs text-warm-gray mt-0.5">{rate.carrier} · {rate.time}</p>
                    {rate.note && (
                      <p className="font-body text-xs text-gold mt-0.5">{rate.note}</p>
                    )}
                  </div>
                  <p className="font-body text-sm text-charcoal font-medium">{rate.price}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-warm-gray mt-6">
              We ship to all 50 US states. We do not ship to P.O. Boxes or internationally at this time.
            </p>
          </section>

          {/* Packaging */}
          <section className="mb-16">
            <h2 className="label-caps text-charcoal mb-6">Packaging</h2>
            <div className="w-full h-px bg-charcoal/10 mb-6" />
            <p className="font-body text-sm text-warm-gray leading-[1.9]">
              Every arrangement ships in a custom matte gift box with tissue paper, a printed care card, and protective foam inserts to prevent movement in transit. Your order arrives ready to gift — no additional wrapping required.
            </p>
          </section>

          {/* Returns */}
          <section className="mb-16">
            <h2 className="label-caps text-charcoal mb-6">Returns & Damages</h2>
            <div className="w-full h-px bg-charcoal/10 mb-6" />
            <p className="font-body text-sm text-warm-gray leading-[1.9] mb-4">
              Due to the nature of preserved botanical products, <strong className="text-charcoal font-medium">all sales are final</strong>. We do not accept returns or exchanges.
            </p>
            <p className="font-body text-sm text-warm-gray leading-[1.9]">
              If your arrangement arrives damaged or defective, please contact us at{' '}
              <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">
                hello@lesfleursdesign.com
              </a>{' '}
              within <strong className="text-charcoal font-medium">48 hours of delivery</strong> with your order number and photographs of the damage. We will assess the situation and arrange a replacement where applicable.
            </p>
          </section>

          <div className="border border-charcoal/10 p-8">
            <p className="font-body text-sm text-warm-gray leading-[1.8]">
              Questions about your order?{' '}
              <Link href="/contact" className="text-charcoal underline underline-offset-4 hover:text-stone transition-colors duration-200">
                Get in touch
              </Link>{' '}
              and we'll respond within 1–2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

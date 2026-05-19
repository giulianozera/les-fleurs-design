import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Les Fleurs Design',
};

const LAST_UPDATED = 'May 2026';

export default function TermsPage() {
  return (
    <div className="bg-ivory pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="label-caps text-warm-gray mb-5">Legal</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-4">
            Terms of Service.
          </h1>
          <p className="font-body text-xs text-warm-gray mb-16">Last updated: {LAST_UPDATED}</p>

          <div className="flex flex-col gap-12 font-body text-sm text-warm-gray leading-[1.9]">

            <Section title="1. Acceptance of Terms">
              <p>By accessing or purchasing from lesfleursdesign.com ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
            </Section>

            <Section title="2. Products">
              <p>Les Fleurs Design sells preserved botanical arrangements and related products. All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to limit quantities or refuse service at our discretion.</p>
              <p className="mt-3">Product colors may vary slightly from images displayed on the Site due to monitor calibration and photography conditions.</p>
            </Section>

            <Section title="3. Orders & Payment">
              <p>By placing an order, you represent that you are authorized to use the payment method provided. Payment is processed securely through Stripe. Order confirmation via email constitutes acceptance of your order by Les Fleurs Design.</p>
              <p className="mt-3">We reserve the right to cancel any order due to pricing errors, suspected fraud, or stock unavailability. A full refund will be issued in such cases.</p>
            </Section>

            <Section title="4. Shipping">
              <p>We ship to all 50 US states via UPS. Delivery estimates are not guaranteed. Les Fleurs Design is not responsible for carrier delays. Risk of loss passes to the customer upon delivery confirmation by the carrier.</p>
            </Section>

            <Section title="5. Returns & Refunds">
              <p>All sales are final. Due to the perishable nature of preserved botanical products, we do not accept returns or exchanges. If your order arrives damaged, contact us within 48 hours of delivery with photographic evidence and we will assess replacement options at our discretion.</p>
            </Section>

            <Section title="6. Intellectual Property">
              <p>All content on the Site — including images, copy, logos, and design — is the property of Les Fleurs Design and protected by copyright law. You may not reproduce, distribute, or create derivative works without written permission.</p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p>To the fullest extent permitted by law, Les Fleurs Design shall not be liable for any indirect, incidental, or consequential damages arising from use of the Site or products purchased. Our total liability shall not exceed the amount paid for the applicable order.</p>
            </Section>

            <Section title="8. Governing Law">
              <p>These Terms are governed by the laws of the State of Florida, United States. Any disputes shall be resolved in the courts of Miami-Dade County, Florida.</p>
            </Section>

            <Section title="9. Changes to Terms">
              <p>We reserve the right to update these Terms at any time. Continued use of the Site following changes constitutes acceptance of the updated Terms.</p>
            </Section>

            <Section title="10. Contact">
              <p>
                Questions regarding these Terms may be sent to{' '}
                <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">
                  hello@lesfleursdesign.com
                </a>
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label-caps text-charcoal mb-4">{title}</h2>
      <div className="w-full h-px bg-charcoal/10 mb-5" />
      {children}
    </div>
  );
}

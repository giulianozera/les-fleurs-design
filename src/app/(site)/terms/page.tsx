import type { Metadata } from 'next';
import { legalName, formatMailingAddress, supportEmail } from '@/lib/site-config';

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
          <p className="font-body text-xs text-warm-gray mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="font-body text-sm text-charcoal leading-[1.9] mb-16">
            <p className="font-medium">{legalName}</p>
            <p>{formatMailingAddress()}</p>
          </div>

          <div className="flex flex-col gap-12 font-body text-sm text-warm-gray leading-[1.9]">

            <Section title="1. Acceptance of Terms">
              <p>By accessing or purchasing from lesfleursdesign.com ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
            </Section>

            <Section title="2. Eligibility">
              <p>You must be at least 18 years of age, or the age of majority in your jurisdiction if higher, and have the legal capacity to enter into a binding contract in order to purchase from the Site. By checking the consent box at checkout and placing an order, you affirm that you meet these requirements and that all information you provide is accurate.</p>
            </Section>

            <Section title="3. Products">
              <p>Les Fleurs Design sells preserved botanical arrangements and related products. All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to limit quantities or refuse service at our discretion.</p>
              <p className="mt-3">Product colors may vary slightly from images displayed on the Site due to monitor calibration and photography conditions.</p>
            </Section>

            <Section title="4. Orders & Payment">
              <p>By placing an order, you represent that you are authorized to use the payment method provided. Payment is processed securely through Stripe. Order confirmation via email constitutes acceptance of your order by Les Fleurs Design.</p>
              <p className="mt-3">We reserve the right to cancel any order due to pricing errors, suspected fraud, or stock unavailability. A full refund will be issued in such cases.</p>
            </Section>

            <Section title="5. Electronic Communications & Signatures">
              <p>You consent to receive these Terms, our Privacy Policy, and all related agreements, notices, disclosures, receipts, and order and shipping confirmations from Les Fleurs Design in electronic form, whether via email or by posting on the Site. You agree that electronic communications satisfy any legal requirement that such communications be in writing.</p>
              <p className="mt-3">By checking the consent box at checkout and clicking &ldquo;Proceed to Checkout,&rdquo; you provide a binding electronic signature and intend to be legally bound by these Terms to the same extent as a handwritten signature, consistent with the federal E-SIGN Act and Fla. Stat. &sect; 668.50.</p>
              <p className="mt-3">
                You may withdraw your consent to electronic communications or request a paper copy of any record by contacting us at{' '}
                <a href={`mailto:${supportEmail}`} className="text-charcoal underline underline-offset-4">
                  {supportEmail}
                </a>. Withdrawing consent may prevent you from completing a purchase, as our checkout is conducted electronically.
              </p>
            </Section>

            <Section title="6. Shipping">
              <p>We ship to all 50 US states via UPS. Delivery estimates are not guaranteed. Les Fleurs Design is not responsible for carrier delays. Risk of loss passes to the customer upon delivery confirmation by the carrier.</p>
            </Section>

            <Section title="7. Returns & Refunds">
              <p>
                All sales are final. Because our arrangements are made-to-order and individually finished, we do not accept returns or exchanges. If your order arrives damaged or defective, contact us at{' '}
                <a href={`mailto:${supportEmail}`} className="text-charcoal underline underline-offset-4">
                  {supportEmail}
                </a>{' '}
                within 7 days of delivery with your order number and photographs, and we will arrange a replacement or store credit where applicable.
              </p>
            </Section>

            <Section title="8. Intellectual Property">
              <p>The Les Fleurs Design name, logo, trademarks, and original written content are the property of Les Fleurs Design and protected by applicable law. Other materials appearing on the Site are used under license or are otherwise owned by Les Fleurs Design. You may not reproduce, distribute, or create derivative works from our protected materials without written permission.</p>
            </Section>

            <Section title="9. Disclaimer of Warranties">
              <p className="font-semibold uppercase tracking-wide text-charcoal">Except as expressly stated, products are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranty of any kind. To the fullest extent permitted by applicable law, Les Fleurs Design disclaims all implied warranties, including the implied warranties of merchantability and fitness for a particular purpose.</p>
              <p className="mt-3">Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.</p>
            </Section>

            <Section title="10. Limitation of Liability">
              <p className="font-semibold uppercase tracking-wide text-charcoal">To the fullest extent permitted by law, Les Fleurs Design shall not be liable for any indirect, incidental, special, or consequential damages arising from use of the Site or products purchased. In no event shall the total liability of Les Fleurs Design exceed the amount you paid for the applicable order.</p>
              <p className="mt-3">Some jurisdictions do not allow the limitation or exclusion of liability for certain damages, so some of the above limitations may not apply to you.</p>
            </Section>

            <Section title="11. Indemnification">
              <p>You agree to indemnify, defend, and hold harmless {legalName} and its members, officers, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&rsquo; fees, arising out of or related to your breach of these Terms or your unlawful or improper use of the Site.</p>
            </Section>

            <Section title="12. Governing Law">
              <p>These Terms are governed by the laws of the State of Florida, United States. Any disputes shall be resolved in the courts of Miami-Dade County, Florida.</p>
            </Section>

            <Section title="13. General Provisions">
              <p><span className="font-medium text-charcoal">Severability.</span> If any provision of these Terms is held to be invalid or unenforceable, that provision will be limited or severed to the minimum extent necessary, and the remaining provisions will remain in full force and effect.</p>
              <p className="mt-3"><span className="font-medium text-charcoal">Entire Agreement.</span> These Terms, together with our Privacy Policy and any policies referenced at checkout, constitute the entire agreement between you and Les Fleurs Design regarding the Site and supersede any prior agreements or understandings.</p>
              <p className="mt-3"><span className="font-medium text-charcoal">No Waiver.</span> Our failure to enforce any right or provision of these Terms will not constitute a waiver of that right or provision.</p>
              <p className="mt-3"><span className="font-medium text-charcoal">Assignment.</span> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of all or substantially all of our assets.</p>
              <p className="mt-3"><span className="font-medium text-charcoal">Force Majeure.</span> Les Fleurs Design is not liable for any delay or failure to perform resulting from causes beyond its reasonable control, including acts of God, natural disasters, labor disputes, carrier delays, or interruptions in supply or telecommunications.</p>
            </Section>

            <Section title="14. Changes to Terms">
              <p>We reserve the right to update these Terms at any time. Continued use of the Site following changes constitutes acceptance of the updated Terms.</p>
            </Section>

            <Section title="15. Contact">
              <p>
                Questions regarding these Terms may be sent to{' '}
                <a href={`mailto:${supportEmail}`} className="text-charcoal underline underline-offset-4">
                  {supportEmail}
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

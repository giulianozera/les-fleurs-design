import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Les Fleurs Design',
};

const LAST_UPDATED = 'May 2026';

export default function PrivacyPage() {
  return (
    <div className="bg-ivory pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="label-caps text-warm-gray mb-5">Legal</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-4">
            Privacy Policy.
          </h1>
          <p className="font-body text-xs text-warm-gray mb-16">Last updated: {LAST_UPDATED}</p>

          <div className="flex flex-col gap-12 font-body text-sm text-warm-gray leading-[1.9]">

            <Section title="1. Who We Are">
              <p>Les Fleurs Design ("we", "us", "our") operates lesfleursdesign.com. We are based in Miami, Florida, USA. For privacy-related inquiries, contact us at <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">hello@lesfleursdesign.com</a>.</p>
            </Section>

            <Section title="2. Information We Collect">
              <p className="mb-3"><strong className="text-charcoal font-medium">Information you provide:</strong></p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'Name and email address (orders, newsletter, contact forms)',
                  'Shipping address (orders)',
                  'Payment information — processed directly by Stripe; we do not store card details',
                  'Company name and inquiry details (wholesale forms)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5"><strong className="text-charcoal font-medium">Information collected automatically:</strong> Standard web server logs including IP address, browser type, pages visited, and referring URLs. We do not use tracking pixels or behavioral advertising cookies.</p>
            </Section>

            <Section title="3. How We Use Your Information">
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'To process and fulfill your orders',
                  'To send order confirmation and shipping notifications',
                  'To respond to contact and wholesale inquiries',
                  'To send newsletter communications (only if you opted in)',
                  'To maintain the security and integrity of our platform',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
            </Section>

            <Section title="4. Third-Party Services">
              <p className="mb-3">We use the following third-party services to operate our business:</p>
              <div className="flex flex-col divide-y divide-charcoal/10">
                {[
                  { name: 'Stripe', purpose: 'Payment processing', link: 'stripe.com/privacy' },
                  { name: 'Supabase', purpose: 'Order and subscriber database', link: 'supabase.com/privacy' },
                  { name: 'Resend', purpose: 'Transactional email delivery', link: 'resend.com/legal/privacy-policy' },
                  { name: 'Sanity', purpose: 'Content management', link: 'sanity.io/legal/privacy' },
                  { name: 'Vercel', purpose: 'Website hosting', link: 'vercel.com/legal/privacy-policy' },
                ].map(({ name, purpose, link }) => (
                  <div key={name} className="py-3 flex justify-between gap-6">
                    <div>
                      <span className="text-charcoal font-medium">{name}</span>
                      <span className="ml-2 text-warm-gray">— {purpose}</span>
                    </div>
                    <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-warm-gray hover:text-charcoal underline underline-offset-4 flex-shrink-0">
                      Privacy policy
                    </a>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="5. Data Retention">
              <p>Order data is retained for 7 years as required by US tax law. Newsletter subscriber data is retained until you unsubscribe. You may request deletion of your data at any time by emailing us.</p>
            </Section>

            <Section title="6. Your Rights">
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'Access the personal data we hold about you',
                  'Request correction of inaccurate data',
                  'Request deletion of your data',
                  'Opt out of marketing communications at any time',
                  'Data portability (where applicable)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5">To exercise any of these rights, contact <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">hello@lesfleursdesign.com</a>.</p>
            </Section>

            <Section title="7. Cookies">
              <p>We use only essential session cookies required for cart functionality. We do not use advertising or analytics cookies. No cookie consent banner is displayed because we collect no tracking data.</p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>Our Site is not directed to individuals under 13 years of age. We do not knowingly collect personal data from children.</p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>We may update this Privacy Policy periodically. Material changes will be communicated via email to active customers or by a prominent notice on the Site.</p>
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

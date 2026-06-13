import type { Metadata } from 'next';
import { legalName, formatMailingAddress, supportEmail } from '@/lib/site-config';

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
          <p className="font-body text-xs text-warm-gray mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="mb-16 font-body text-sm text-charcoal/80 leading-[1.9]">
            <p className="text-charcoal font-medium">{legalName}</p>
            <p className="text-charcoal/80">{formatMailingAddress()}</p>
          </div>

          <div className="flex flex-col gap-12 font-body text-sm text-warm-gray leading-[1.9]">

            <Section title="1. Who We Are">
              <p>Les Fleurs Design ("we", "us", "our") operates lesfleursdesign.com. We are based in Miami, Florida, USA. For privacy-related inquiries, contact us at <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">hello@lesfleursdesign.com</a>.</p>
            </Section>

            <Section title="2. Information We Collect">
              <p className="mb-3"><strong className="text-charcoal font-medium">Information you provide:</strong></p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'Name and email address (orders, newsletter, contact forms)',
                  'Phone number (collected at checkout and on business/interiors inquiry forms, used for order/delivery coordination only — not SMS marketing)',
                  'Shipping address (orders)',
                  'Payment information — processed directly by Stripe; we do not store card details',
                  'Company name and inquiry details (wholesale, business, and interiors forms)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5">To fulfill orders, we share your shipping name and address with our shipping/label provider (EasyPost) and the delivery carrier; see Section 4 for details.</p>
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
                  { name: 'EasyPost', purpose: 'Shipping label generation & tracking', link: 'easypost.com/privacy-policy' },
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
              <p className="mt-5">To ship your order, we share your shipping name and address with our shipping/label provider (EasyPost) and the delivery carrier so they can generate a shipping label and deliver your package. We do not share this information for any other purpose.</p>
            </Section>

            <Section title="5. Data Retention">
              {/* TODO: confirm retention periods (order/tax 7yr, inquiry/contact 24mo) with counsel before launch. */}
              <p>Order data is retained for 7 years as required by US tax law. Inquiry and contact-form messages (including business and interiors inquiries) are retained for up to 24 months unless deletion is requested sooner. Newsletter subscriber data is retained until you unsubscribe. You may request deletion of your data at any time by emailing us.</p>
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

            <Section title="7. Cookies & Browser Storage">
              {/*
                COMPLIANCE PASS (verified) — cookie statement VERIFIED ACCURATE in substance,
                and the two descriptive imprecisions flagged by the audit are now CORRECTED in
                the copy below. The substantive claim is TRUE per a full src audit: NO analytics
                or advertising cookies/SDKs anywhere (no @vercel/analytics, GA/gtag, Meta Pixel,
                Plausible, PostHog, Mixpanel, Hotjar, Clarity, Segment), NO consent banner, and the
                cart's first-party storage is "strictly necessary" and consent-exempt under
                ePrivacy/GDPR, so the no-banner conclusion holds.
                Corrections applied: (1) the cart is browser localStorage (zustand persist), not a
                "cookie"; (2) it is persistent, not "session"-scoped. The Stripe checkout-redirect
                cookies (set on Stripe's domain) are now disclosed for completeness. Sanity Studio
                auth storage applies only to logged-in CMS editors at /studio, not to shoppers.
              */}
              <p>We use only essential, first-party browser storage (localStorage) to remember the contents of your shopping cart. This is strictly necessary for the Site to function and is not used to track you. We do not use advertising or analytics cookies, and no cookie consent banner is displayed because we collect no tracking data. When you check out, our payment processor (Stripe) may set its own cookies on its hosted checkout page to process your payment securely.</p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>Our Site is not directed to individuals under 13 years of age. We do not knowingly collect personal data from children.</p>
            </Section>

            <Section title="9. California Privacy Rights">
              <p className="mb-3">If you are a California resident, the California Consumer Privacy Act (CCPA/CPRA) gives you certain rights regarding your personal information.</p>
              <p className="mb-3"><strong className="text-charcoal font-medium">We do not sell or share your personal information.</strong> We do not sell your personal information, and we do not share it for cross-context behavioral advertising. We use no advertising or analytics cookies.</p>
              <p className="mb-3"><strong className="text-charcoal font-medium">Categories of personal information we collect</strong> and the business purposes for each:</p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'Identifiers (name, email, phone number, shipping address) — to process orders, coordinate delivery, and respond to inquiries',
                  'Commercial / transaction information (products purchased, order history) — to fulfill and record your orders',
                  'Internet / electronic network activity (server logs such as IP address, browser type, pages visited) — to maintain the security and integrity of the Site',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 mb-3">Subject to applicable exceptions, California residents have the right to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  'Know what personal information we collect and how we use it',
                  'Request deletion of personal information we hold about you',
                  'Request correction of inaccurate personal information',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5">We will not discriminate or retaliate against you for exercising any of these rights. To submit a request, email <a href={`mailto:${supportEmail}`} className="text-charcoal underline underline-offset-4">{supportEmail}</a>. We may need to verify your identity before fulfilling your request.</p>
            </Section>

            <Section title="10. Changes to This Policy">
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

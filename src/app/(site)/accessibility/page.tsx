import type { Metadata } from 'next';
import { supportEmail } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Accessibility — Les Fleurs Design',
};

// TODO: confirm and update the month/year this statement was last reviewed before launch.
const LAST_UPDATED = 'TODO: month/year';

export default function AccessibilityPage() {
  return (
    <div className="bg-ivory pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="label-caps text-warm-gray mb-5">Legal</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="font-body text-xs text-warm-gray mb-16">Last updated: {LAST_UPDATED}</p>

          <div className="flex flex-col gap-12 font-body text-sm text-warm-gray leading-[1.9]">

            <Section title="Our Commitment">
              <p>Les Fleurs Design is committed to making lesfleursdesign.com accessible to everyone, including people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.</p>
            </Section>

            <Section title="Feedback & Assistance">
              <p>We are continually improving the user experience for all visitors and applying relevant accessibility standards. If you encounter any difficulty using our site, or need assistance with any part of it, please contact us at <a href={`mailto:${supportEmail}`} className="text-charcoal underline underline-offset-4">{supportEmail}</a> and we will work with you to provide the information, item, or service you need through an accessible method.</p>
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

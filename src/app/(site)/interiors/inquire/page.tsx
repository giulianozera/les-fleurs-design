import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectInquiryForm } from '@/components/interiors/ProjectInquiryForm';

export const metadata: Metadata = {
  title: 'Start a Project — Interiors',
  description:
    'Tell us about your space — hotel, restaurant, office, retail, or residence. We design preserved-rose pieces around your project and reply within 1–2 business days.',
};

type Props = { searchParams: Promise<{ space?: string }> };

export default async function InquirePage({ searchParams }: Props) {
  const { space } = await searchParams;
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  return (
    <div className="bg-ivory">
      <section className="pt-[72px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
          <Link
            href="/interiors"
            className="label-caps text-charcoal/70 hover:text-charcoal transition-colors duration-300"
          >
            <span aria-hidden="true">←</span> Interiors
          </Link>

          <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">
            {/* Left — form */}
            <div>
              <p className="label-caps text-charcoal/70 mb-4">Start a Project</p>
              <h1 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-light text-charcoal mb-6 leading-tight">
                Tell us about the space.
              </h1>
              <p className="font-body text-sm text-charcoal/75 leading-[1.9] mb-10 max-w-[44ch]">
                Hotels, restaurants, offices, retail, or a private residence — share the project and we’ll
                reply within 1–2 business days.
              </p>
              <ProjectInquiryForm defaultSpace={space ?? ''} />
            </div>

            {/* Right — book a consultation */}
            <div id="book" className="mt-16 lg:mt-0 scroll-mt-[88px]">
              <p className="label-caps text-charcoal/70 mb-4">Or Book a Consultation</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal mb-10 leading-tight">
                Speak with us directly.
              </h2>
              <div className="border border-charcoal/10 overflow-hidden">
                <iframe
                  src={`${calLink}?embed=true&theme=light&layout=month_view`}
                  className="w-full"
                  style={{ height: '560px', border: 'none' }}
                  title="Book a consultation — Les Fleurs Design"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqAccordion } from '@/components/faq/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQ — Les Fleurs Design',
  description: 'Answers to common questions about preserved roses, shipping, and wholesale.',
};

export default function FaqPage() {
  return (
    <div className="bg-ivory pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="label-caps text-warm-gray mb-5">FAQ</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-16">
            Frequently Asked.
          </h1>

          <FaqAccordion />

          <div className="mt-20 border border-charcoal/10 p-8">
            <p className="font-body text-sm text-warm-gray leading-[1.8]">
              Still have a question?{' '}
              <Link href="/contact" className="text-charcoal underline underline-offset-4 hover:text-stone transition-colors duration-200">
                Contact us
              </Link>{' '}
              and we'll get back to you within 1–2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

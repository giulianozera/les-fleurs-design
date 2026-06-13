import type { Metadata } from 'next';
import Link from 'next/link';
import { InteriorsShowcase } from '@/components/interiors/InteriorsShowcase';

export const metadata: Metadata = {
  title: 'Interiors — Les Fleurs Design',
  description:
    'Preserved-rose pieces for hotels, restaurants, offices, retail, and high-end residential projects. Commissioned around your space — palette, scale, and material.',
};

export default function InteriorsPage() {
  return (
    <div className="bg-ivory">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-40">
          <p className="label-caps text-ivory/65 mb-8">Interiors</p>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.92] max-w-3xl">
            The space becomes the statement.
          </h1>
          <p className="font-body text-sm text-ivory/75 leading-[1.9] mt-10 max-w-[44ch]">
            Preserved roses, composed as objects of design — for the hotels, restaurants, offices, retail
            spaces, and residences that refuse to settle for decoration.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/interiors/inquire"
              className="inline-block px-8 py-3.5 label-caps text-ivory bg-ivory/10 border border-ivory/20 hover:bg-ivory/20 transition-colors duration-300"
            >
              Start a Project
            </Link>
            <Link
              href="/interiors/inquire#book"
              className="inline-block px-8 py-3.5 label-caps text-ivory/80 border border-ivory/30 hover:text-ivory hover:border-ivory/50 transition-colors duration-300"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ── Two-track showcase + prototype carousel ───────────────────────────── */}
      <InteriorsShowcase />

      {/* ── Closing CTA ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="label-caps text-charcoal/70 mb-6">Every Space Is Different</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight mb-8">
            Every commission is made for it.
          </h2>
          <div className="w-8 h-px bg-gold mb-8" />
          <p className="font-body text-sm text-charcoal/75 leading-[2] mb-10 max-w-[52ch]">
            We begin with a conversation — scale, palette, vessel, and the feeling the room needs to hold —
            and return a proposal within one week. Recurring placements and trade pricing are available for
            established venues and design practices.
          </p>
          <Link
            href="/interiors/inquire"
            className="inline-block px-8 py-3.5 label-caps text-ivory bg-charcoal hover:bg-stone transition-colors duration-300"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}

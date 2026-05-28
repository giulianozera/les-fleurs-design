import type { Metadata } from 'next';
import Link from 'next/link';
import { CommissionForm } from '@/components/b2b/CommissionForm';
import { InquiryForm } from '@/components/b2b/InquiryForm';

export const metadata: Metadata = {
  title: 'Interiors — Les Fleurs Design',
  description:
    'Preserved rose arrangements for interior designers, architects, and residential projects. Commission bespoke pieces designed around your project's palette, scale, and material language.',
};

// ── Portfolio placeholder grid ────────────────────────────────────────────────

function PortfolioPlaceholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      className="relative w-full bg-ivory-dark flex items-end p-4"
      style={{ aspectRatio: ratio }}
    >
      {/* TODO: replace with <Image src="…" fill className="object-cover" alt="…" /> */}
      <p className="label-caps text-charcoal/20 text-[9px]">{label}</p>
    </div>
  );
}

// ── Selected pieces placeholder ───────────────────────────────────────────────

function PiecePlaceholder({ title, collection, price }: { title: string; collection: string; price: string }) {
  return (
    <div>
      {/* TODO: replace placeholder with real ProductCard once pieces are curated */}
      <div
        className="w-full bg-ivory-dark flex items-center justify-center"
        style={{ aspectRatio: '4/5' }}
      >
        <p className="label-caps text-charcoal/20 text-[9px]">Coming Soon</p>
      </div>
      <div className="mt-3 px-0.5">
        <p className="label-caps text-warm-gray mb-1">{collection}</p>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-light text-charcoal leading-snug">{title}</h3>
          <p className="label-caps text-charcoal/70 flex-shrink-0 mt-0.5">{price}</p>
        </div>
      </div>
    </div>
  );
}

const FEATURED_PIECES = [
  /* TODO: curate 3 products best suited to residential / interior design projects.
     Replace these placeholders with real slugs, titles, and prices from Sanity. */
  { title: 'Ivory Dome in Blue Porcelain', collection: 'Maison Collection', price: 'From $195' },
  { title: 'Champagne on Travertine', collection: 'The Signature Series', price: 'From $320' },
  { title: 'Grand Dome in Matte Black', collection: 'The Signature Series', price: 'From $480' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InteriorsPage() {
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  return (
    <div className="bg-ivory">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-40">
          <p className="label-caps text-ivory/30 mb-8">Interiors</p>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.92] max-w-3xl">
            An object designed for the room it will inhabit.
          </h1>
          <p className="font-body text-sm text-ivory/50 leading-[1.9] mt-10 max-w-[42ch]">
            For interior designers and architects who work to a higher standard of material and intention. A piece you specify with confidence — and one your client will never want to change.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#commission"
              className="inline-block px-8 py-3.5 label-caps text-ivory bg-ivory/10 border border-ivory/20 hover:bg-ivory/20 transition-colors duration-300"
            >
              Start a Commission
            </a>
            <a
              href="#contact"
              className="inline-block px-8 py-3.5 label-caps text-ivory/60 border border-ivory/20 hover:text-ivory hover:border-ivory/40 transition-colors duration-300"
            >
              General Inquiry
            </a>
          </div>
        </div>
      </section>

      {/* ── Portfolio gallery ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <p className="label-caps text-warm-gray mb-12">Selected Projects</p>

        {/* TODO: replace placeholders with real portfolio images when available */}
        {/* Editorial offset grid — right: tall portrait; left: landscape + portrait stacked (mirrored from /business) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-4">
          {/* Left — two stacked */}
          <div className="flex flex-col gap-4">
            <PortfolioPlaceholder label="Living room — private residence" ratio="4/3" />
            <PortfolioPlaceholder label="Master bedroom detail" ratio="4/3" />
          </div>
          {/* Right — full-height portrait */}
          <PortfolioPlaceholder label="Entryway installation — Miami penthouse" ratio="3/4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <PortfolioPlaceholder label="Library corner — travertine vessel" ratio="16/9" />
          <PortfolioPlaceholder label="Dining room — blue porcelain dome" ratio="16/9" />
        </div>

        <p className="font-body text-xs text-warm-gray/50 mt-6">
          {/* TODO: remove once real images are in */}
          Portfolio images coming soon. Contact us to request a lookbook.
        </p>
      </section>

      {/* ── Selected pieces ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="label-caps text-warm-gray mb-3">Suited to Residential Projects</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal">
              Selected works.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 label-caps text-charcoal/50 hover:text-charcoal transition-colors duration-300 group"
          >
            View Full Collection
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {FEATURED_PIECES.map((piece) => (
            <PiecePlaceholder key={piece.title} {...piece} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/shop" className="label-caps text-charcoal/50 hover:text-charcoal transition-colors duration-300">
            View Full Collection →
          </Link>
        </div>
      </section>

      {/* ── Custom commissions ────────────────────────────────────────────────── */}
      <section id="commission" className="bg-ivory-dark py-24 md:py-32 border-b border-charcoal/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-start">

            {/* Left — copy */}
            <div className="mb-12 lg:mb-0">
              <p className="label-caps text-warm-gray mb-6">Custom Commissions</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight mb-8">
                Commission a piece that belongs to the project.
              </h2>
              <div className="w-8 h-px bg-gold mb-8" />
              <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
                We collaborate with interior designers and architects to produce pieces that are designed — not placed. That means beginning with your project&rsquo;s palette, material language, and the emotional register of the room.
              </p>
              <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
                Scale, vessel, bloom — each element is specified to your brief. We produce a proposal within one week of our first conversation, and deliver in 3–5 weeks from approval.
              </p>
              <p className="font-body text-sm text-warm-gray leading-[2]">
                Trade pricing is available for established design practices. Mention your firm when you reach out.
              </p>
            </div>

            {/* Right — form */}
            <div>
              <CommissionForm variant="interiors" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact + Book a call ─────────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20">

          {/* Left — general inquiry */}
          <div>
            <p className="label-caps text-warm-gray mb-4">General Inquiry</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal mb-10 leading-tight">
              Tell us about your project.
            </h2>
            <InquiryForm variant="interiors" />
          </div>

          {/* Right — Cal.com */}
          <div className="mt-16 lg:mt-0">
            <p className="label-caps text-warm-gray mb-4">Or Book a Call</p>
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
      </section>

    </div>
  );
}

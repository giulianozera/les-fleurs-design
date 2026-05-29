import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CommissionForm } from '@/components/b2b/CommissionForm';
import { InquiryForm } from '@/components/b2b/InquiryForm';

export const metadata: Metadata = {
  title: 'For Business — Les Fleurs Design',
  description:
    'Preserved rose arrangements for hotels, restaurants, offices, and events. Custom commissions and volume programs for commercial spaces that demand distinction.',
};

// ── Portfolio image component ─────────────────────────────────────────────────

function PortfolioImage({
  src,
  alt,
  caption,
  className = '',
  imgClassName = 'object-cover',
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <figure className="group flex flex-col">
      <div className={`relative w-full overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`transition-transform duration-700 ease-out group-hover:scale-[1.02] ${imgClassName}`}
        />
      </div>
      <figcaption className="mt-3.5 flex items-center gap-3">
        <div className="w-5 h-px bg-[#A06855]/70 flex-shrink-0" />
        <p className="font-body text-[11px] tracking-[0.18em] uppercase text-charcoal/70">
          {caption}
        </p>
      </figcaption>
    </figure>
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
  /* TODO: curate 3 products best suited to commercial / hospitality spaces.
     Replace these placeholders with real slugs, titles, and prices from Sanity. */
  { title: 'Grand Dome in Blue Porcelain', collection: 'Maison Collection', price: 'From $480' },
  { title: 'White Roses in Matte Black', collection: 'The Eternal Edit', price: 'From $240' },
  { title: 'Champagne on Travertine', collection: 'The Signature Series', price: 'From $320' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BusinessPage() {
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  return (
    <div className="bg-ivory">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-40">
          <p className="label-caps text-ivory/30 mb-8">For Business</p>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.92] max-w-3xl">
            The space becomes the statement.
          </h1>
          <p className="font-body text-sm text-ivory/50 leading-[1.9] mt-10 max-w-[42ch]">
            From boutique hotels to private members&rsquo; clubs. Les Fleurs Design brings permanence to the spaces that refuse to settle for decoration.
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

        {/* Main row: Private club · Restaurant · Installation */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_0.6fr] gap-4">
          <PortfolioImage
            src="/business/private member club .png"
            alt="Private members' club arrangement"
            caption="Private Members' Club"
            className="h-[340px] md:h-[480px]"
            imgClassName="object-cover object-center"
          />
          <PortfolioImage
            src="/business/restourant table.jpg"
            alt="Restaurant table arrangement"
            caption="Restaurant"
            className="h-[340px] md:h-[480px]"
            imgClassName="object-cover object-center"
          />
          <PortfolioImage
            src="/business/event inistallation.JPG"
            alt="Event floral installation"
            caption="Event Installation"
            className="h-[340px] md:h-[480px]"
            imgClassName="object-cover object-top"
          />
        </div>

        {/* Secondary row: Hotel lobby · Suite amenity · Corporate */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.75fr_1fr] gap-4 mt-8 items-end">
          <PortfolioImage
            src="/business/hotel lobby.jpg"
            alt="Hotel lobby installation"
            caption="Hotel Lobby"
            className="h-[260px] md:h-[340px]"
            imgClassName="object-cover object-center"
          />
          <PortfolioImage
            src="/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg"
            alt="Suite amenity — blue porcelain vessel"
            caption="Suite Amenity"
            className="h-[380px] md:h-[480px]"
            imgClassName="object-cover object-center"
          />
          <PortfolioImage
            src="/business/corporate .png"
            alt="Corporate reception arrangement"
            caption="Corporate Reception"
            className="h-[260px] md:h-[340px]"
            imgClassName="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Selected pieces ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="label-caps text-warm-gray mb-3">Suited to Commercial Spaces</p>
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
                Every space is different.
                <br />
                Every commission is made for it.
              </h2>
              <div className="w-8 h-px bg-gold mb-8" />
              <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
                We work with hotels, restaurants, and commercial spaces to design pieces built around the specific qualities of a room — its proportions, material language, and the feeling it needs to hold.
              </p>
              <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
                A commission begins with a conversation. We discuss scale, palette, vessel material, and installation intent. From there, we produce a proposal within one week.
              </p>
              <p className="font-body text-sm text-warm-gray leading-[2]">
                Volume programs — recurring placements for multiple rooms or locations — are also available. Reach out to discuss.
              </p>
            </div>

            {/* Right — form */}
            <div>
              <CommissionForm variant="business" />
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
            <InquiryForm variant="business" />
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

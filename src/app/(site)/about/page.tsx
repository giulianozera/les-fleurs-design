import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Story — Les Fleurs Design',
  description:
    'The story behind Les Fleurs Design — a Miami atelier founded on a refusal to accept that beauty must be temporary.',
};

const PILLARS = [
  {
    number: '01',
    title: 'The Bloom',
    body: 'We source only long-stem roses at peak bloom — a 48-hour window when form and color are at their most precise.',
  },
  {
    number: '02',
    title: 'The Process',
    body: 'Through a glycerin-based preservation method, natural sap is gently replaced. The rose retains its structure and softness without water or light.',
  },
  {
    number: '03',
    title: 'The Vessel',
    body: 'Each arrangement is set into a handcrafted ceramic vessel. Matte glazes, clean geometry, and weighted bases built to last as long as the rose.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-40">
          <p className="label-caps text-ivory/30 mb-8">Our Story</p>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.92] max-w-3xl">
            A still life that lasts.
          </h1>
          <p className="font-body text-sm text-ivory/40 leading-[1.9] mt-10 max-w-sm">
            Les Fleurs Design. Miami, Florida. Est. 2023.
          </p>
        </div>
      </section>

      {/* ── Founder intro ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-start">

          {/* Left — founder portrait placeholder */}
          <div>
            <div
              className="w-full bg-ivory-dark flex items-end p-6"
              style={{ aspectRatio: '3/4' }}
            >
              {/* TODO: replace with founder portrait
                  <Image src="/founder.jpg" fill className="object-cover" alt="[Founder name], founder of Les Fleurs Design" />
              */}
              <p className="label-caps text-charcoal/20 text-[9px]">Founder portrait — coming soon</p>
            </div>
          </div>

          {/* Right — story text */}
          <div className="mt-10 lg:mt-2">
            <p className="label-caps text-warm-gray mb-6">The Beginning</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight mb-10">
              Permanence is the point.
            </h2>

            {/* TODO: replace with founder's actual story — 3 paragraphs, first-person, intimate.
                Tone: personal, honest, design-forward. Not a press release.
                Example opening: "I started Les Fleurs Design because I couldn't find what I was looking for.
                Not in a florist. Not in a gift shop. Somewhere between a living flower and a work of art —
                something real, made with care, built to stay."
            */}
            <p className="font-body text-sm text-warm-gray leading-[2] mb-6">
              I started Les Fleurs Design because I couldn&rsquo;t find what I was looking for. Every flower I gave eventually disappeared. Every gift I received did the same. I wanted to make something that didn&rsquo;t ask for that trade-off.
            </p>
            <p className="font-body text-sm text-warm-gray leading-[2] mb-6">
              {/* TODO: founder paragraph 2 — the discovery / the process / why Miami */}
              [Founder story — paragraph 2. Replace with your own words.]
            </p>
            <p className="font-body text-sm text-warm-gray leading-[2]">
              {/* TODO: founder paragraph 3 — where the brand is now / what drives it */}
              [Founder story — paragraph 3. Replace with your own words.]
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <p className="label-caps text-warm-gray mb-6">The Philosophy</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight mb-8">
              Not decoration. An object of design.
            </h2>
            <div className="w-8 h-px bg-gold mb-8" />
            {/* TODO: replace with founder's vision statement — 2 paragraphs, first-person.
                Tone: clear, direct, a little uncompromising. This is the brand's manifesto.
                What do you believe about objects, beauty, and permanence?
            */}
            <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
              {/* TODO: philosophy paragraph 1 */}
              [Vision paragraph 1 — what you believe about the role of objects in a space. Replace with your own words.]
            </p>
            <p className="font-body text-sm text-warm-gray leading-[2]">
              {/* TODO: philosophy paragraph 2 */}
              [Vision paragraph 2 — why permanence matters. Why the ceramic vessel matters as much as the rose. Replace with your own words.]
            </p>
          </div>

          {/* Atmospheric image placeholder */}
          <div className="mt-10 lg:mt-0">
            <div
              className="w-full bg-ivory-dark flex items-end p-6"
              style={{ aspectRatio: '4/5' }}
            >
              {/* TODO: replace with atmospheric atelier / process image
                  Options: hand-forming ceramics, close-up of preserved petals, workspace detail
              */}
              <p className="label-caps text-charcoal/20 text-[9px]">Atelier image — coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The craft — 3 pillars ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <p className="label-caps text-warm-gray mb-16">The Craft</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {PILLARS.map((pillar) => (
            <div key={pillar.number}>
              <p className="font-display text-5xl font-light text-charcoal/10 mb-6 leading-none">
                {pillar.number}
              </p>
              <div className="w-8 h-px bg-gold mb-5" />
              <h3 className="font-display text-2xl font-light text-charcoal mb-4">
                {pillar.title}
              </h3>
              <p className="font-body text-sm text-warm-gray leading-[1.9]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────────────────────────── */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-36 text-center">
          <div className="w-8 h-px bg-gold mx-auto mb-10" />
          <blockquote className="font-display text-[clamp(2rem,5vw,4rem)] font-light leading-tight max-w-3xl mx-auto">
            &ldquo;Crafted for permanence. Designed for distinction.&rdquo;
          </blockquote>
          <div className="w-8 h-px bg-gold mx-auto mt-10" />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="border-t border-charcoal/10 pt-8">
            <h3 className="font-display text-2xl font-light text-charcoal mb-3">Shop the Collection</h3>
            <p className="font-body text-sm text-warm-gray leading-[1.8] mb-6">
              Preserved rose arrangements for private clients. Ships across the United States.
            </p>
            <Link href="/shop" className="label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300">
              Browse →
            </Link>
          </div>

          <div className="border-t border-charcoal/10 pt-8">
            <h3 className="font-display text-2xl font-light text-charcoal mb-3">For Business</h3>
            <p className="font-body text-sm text-warm-gray leading-[1.8] mb-6">
              Hotels, restaurants, offices, events. Volume programs and custom commissions available.
            </p>
            <Link href="/business" className="label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300">
              Learn more →
            </Link>
          </div>

          <div className="border-t border-charcoal/10 pt-8">
            <h3 className="font-display text-2xl font-light text-charcoal mb-3">Interiors</h3>
            <p className="font-body text-sm text-warm-gray leading-[1.8] mb-6">
              For interior designers and architects. Commission a piece designed to your brief.
            </p>
            <Link href="/interiors" className="label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300">
              Learn more →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

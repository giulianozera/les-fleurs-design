import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Story — Les Fleurs Design',
  description: 'Roses preserved at peak bloom. A Miami atelier dedicated to permanence.',
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
      {/* Hero */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-40">
          <p className="label-caps text-ivory/30 mb-8">Our Story</p>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.92] max-w-3xl">
            A still life that lasts.
          </h1>
          <p className="font-body text-sm text-ivory/50 leading-[1.9] mt-10 max-w-sm">
            Les Fleurs Design. Miami, Florida. Est. 2023.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32 border-b border-charcoal/10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-start">
          <div>
            <p className="label-caps text-warm-gray mb-6">The Beginning</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight mb-8">
              Permanence is the point.
            </h2>
          </div>
          <div className="mt-6 lg:mt-2">
            <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
              Les Fleurs Design was founded on a simple refusal — to accept that beauty must be temporary. Cut flowers die. Digital flowers don't exist. We wanted something in between: real roses, real craft, real permanence.
            </p>
            <p className="font-body text-sm text-warm-gray leading-[2] mb-5">
              We started with a single question: what does a gift look like one year after it's given? For most flowers, nothing. For ours, the same arrangement that arrived — colors intact, petals soft, structure unchanged.
            </p>
            <p className="font-body text-sm text-warm-gray leading-[2]">
              Today we work with hotels, private clients, and retailers across the United States who share a belief that the spaces they inhabit deserve distinction — not decoration.
            </p>
          </div>
        </div>
      </section>

      {/* The craft — 3 pillars */}
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

      {/* Pull quote */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-28 md:py-36 text-center">
          <div className="w-8 h-px bg-gold mx-auto mb-10" />
          <blockquote className="font-display text-[clamp(2rem,5vw,4rem)] font-light leading-tight max-w-3xl mx-auto">
            &ldquo;Crafted for permanence. Designed for distinction.&rdquo;
          </blockquote>
          <div className="w-8 h-px bg-gold mx-auto mt-10" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal mb-3">
              Ready to explore?
            </h2>
            <p className="font-body text-sm text-warm-gray">
              Browse the collection or reach out for wholesale inquiries.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/shop"
              className="label-caps bg-charcoal text-ivory px-8 py-3.5 hover:bg-stone transition-colors duration-300"
            >
              Shop Collection
            </Link>
            <Link
              href="/wholesale"
              className="label-caps border border-charcoal text-charcoal px-8 py-3.5 hover:bg-charcoal hover:text-ivory transition-colors duration-300"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

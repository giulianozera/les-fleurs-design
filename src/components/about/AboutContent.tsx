'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const GENERATIONS = [
  {
    numeral: 'I',
    year: '1924',
    name: 'Giuseppe\ndi Rosa',
    body: 'Opens the family glasshouse in Italy — field-grown roses for parish weddings and the regional opera house.',
  },
  {
    numeral: 'II',
    year: '1958',
    name: 'Antonio\ndi Rosa',
    body: 'Expands the atelier into ceremonial work — baptisms, funerals, and the great post-war villa commissions.',
  },
  {
    numeral: 'III',
    year: '1989',
    name: 'Lorenzo\ndi Rosa',
    body: 'Introduces architectural floristry — pressed walls, sculpted arches, and the first floral letterforms.',
  },
  {
    numeral: 'IV',
    year: '2023',
    name: 'Matteo\ndi Rosa',
    body: 'Founds Les Fleurs Design in Miami. Carries preserved roses and handcrafted vessels into a new chapter abroad.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' } },
};

/* ─── Thin ornamental rule ─── */
function Rule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-[#1C1C1A]/12" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <circle cx="4" cy="4" r="2" fill="#A06855" fillOpacity="0.5" />
      </svg>
      <div className="flex-1 h-px bg-[#1C1C1A]/12" />
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="bg-[#F9F6F2] selection:bg-[#A06855]/15">

      {/* ══════════════════════════════════════════════════════════
          COVER — Full-bleed hero
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[92vh] flex flex-col overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/sfondo.jpg"
            alt="Les Fleurs Design atelier"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-[#F9F6F2]" />
        </div>

        {/* Cover typography — centered */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 py-24 pt-36">

          {/* Top label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-white/55 mb-8"
          >
            Maison Florale &nbsp;·&nbsp; Miami, Florida
          </motion.p>

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08 }}
            className="font-display text-[clamp(3.5rem,9vw,8rem)] font-light text-white leading-[0.95] tracking-[-0.01em] mb-4"
          >
            Les Fleurs Design
          </motion.h1>

          {/* Sub-label row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-14"
          >
            <div className="h-px w-12 bg-white/30" />
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/45">
              Portfolio &nbsp;·&nbsp; Volume I
            </p>
            <div className="h-px w-12 bg-white/30" />
          </motion.div>

          {/* Est. line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-sm italic text-white/40 mb-0"
          >
            — Est. 2023 &nbsp;·&nbsp; Miami, Florida —
          </motion.p>
        </div>

        {/* Bottom — scroll into next section */}
        <div className="relative z-10 px-6 md:px-16 pb-16 md:pb-20 flex flex-col items-center gap-6">
          <Rule className="w-full max-w-xs" />
          {/* Script + tagline */}
          <div className="text-center">
            <p
              className="text-5xl md:text-6xl text-[#1C1C1A]/80 mb-2"
              style={{ fontFamily: 'var(--font-italianno), cursive' }}
            >
              Les Fleurs
            </p>
            <p className="font-display text-[clamp(1.5rem,4vw,3rem)] font-light italic text-[#1C1C1A] leading-tight mb-4">
              quiet luxury, in full bloom
            </p>
            <p className="font-body text-sm md:text-base leading-[1.9] text-[#1C1C1A]/50 max-w-lg mx-auto">
              Roses preserved at peak bloom, presented in handcrafted ceramic vessels. For gifts,
              lobbies, and the spaces that demand distinction.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CHAPTER I — The Story
      ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-8 py-24 md:py-36">

        {/* Chapter header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-28"
        >
          <p className="font-display text-sm italic text-[#1C1C1A]/30 mb-6">
            — a still life that lasts —
          </p>

          <Rule className="mb-8 max-w-xs mx-auto" />

          <p className="font-body text-[9px] tracking-[0.28em] uppercase text-[#1C1C1A]/30 mb-6">
            Chapter I &nbsp;—&nbsp; The Story
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light text-[#1C1C1A] leading-[1.02] mb-4">
            A still life that lasts
          </h2>
          <p
            className="text-4xl md:text-5xl text-[#A06855]"
            style={{ fontFamily: 'var(--font-italianno), cursive' }}
          >
            our story
          </p>
        </motion.div>

        <Rule className="mb-16 md:mb-20" />

        {/* Story — two columns: prose left, portrait right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 lg:gap-20 items-start">

          {/* Left — prose */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-8"
          >
            <p className="story-lede font-display text-xl md:text-2xl leading-[1.65] text-[#1C1C1A]/85">
              My name is Matteo di Rosa, and I come from a family in Italy that has worked with
              flowers for four generations.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.95] text-[#1C1C1A]/60">
              I was raised between the cutting rooms and the cold storage of my family&rsquo;s
              atelier — in a small corner of Italy where the mornings smelled of wet leaves and
              rose stems, and where my grandfather taught me that a single bloom, handled
              correctly, could carry an entire room. My father arranged the villas. My mother
              arranged the churches. The work was quiet, exact, and never temporary in spirit,
              even when the flowers themselves were.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.95] text-[#1C1C1A]/60">
              Les Fleurs Design is the form that inheritance takes here. I founded the studio to
              bring our family&rsquo;s craft — the patience, the obsession with material, the
              refusal to accept that beauty must be brief — into a new language. Real roses. Real
              ceramic. Real permanence.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.95] text-[#1C1C1A]/60">
              What we make today is the opposite of a cut bouquet. Roses preserved at peak bloom.
              Vessels hand-formed by independent artisans. Objects engineered to last a year on a
              console table, a hotel front desk, a dining room, a private suite. The flowers are
              still real — they have simply been given more time.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.95] text-[#1C1C1A]/60">
              I am carrying my family&rsquo;s heritage across an ocean. The atelier here is small,
              but the conversation is the same one we&rsquo;ve been having for a hundred years:
              how does one make beauty worth keeping?
            </p>

            {/* Signature block */}
            <div className="pt-8 border-t border-[#A06855]/15">
              <p
                className="text-4xl md:text-5xl text-[#A06855] mb-2"
                style={{ fontFamily: 'var(--font-italianno), cursive' }}
              >
                Matteo di Rosa
              </p>
              <p className="font-body text-xs tracking-[0.16em] uppercase text-[#1C1C1A]/30">
                Founder &amp; Designer
              </p>
            </div>
          </motion.div>

          {/* Right — founder portrait */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <Image
                src="/matteo port.png"
                alt="Matteo di Rosa, Founder of Les Fleurs Design"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-4 font-body text-[10px] tracking-[0.18em] uppercase text-[#1C1C1A]/30 text-center">
              Matteo di Rosa &nbsp;·&nbsp; Founder &amp; Designer
            </p>
          </motion.div>

        </div>

        {/* Pull-quote */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-20 md:mt-28"
        >
          <Rule className="mb-12" />
          <div className="text-center max-w-[640px] mx-auto">
            <blockquote>
              <p className="font-display text-[clamp(1.6rem,4vw,3rem)] font-light italic leading-[1.4] text-[#1C1C1A]/80 mb-6">
                &ldquo;A flower is never only a flower. It is a memory that quietly stays in
                the room.&rdquo;
              </p>
            </blockquote>
            <p className="font-body text-[10px] tracking-[0.22em] uppercase text-[#A06855]/60 mb-1">
              — a family saying
            </p>
            <p className="font-body text-[10px] tracking-[0.22em] uppercase text-[#1C1C1A]/25">
              passed down four generations
            </p>
          </div>
          <Rule className="mt-12 mb-16" />

          {/* Closing prose */}
          <p className="font-body text-sm md:text-base leading-[2] text-[#1C1C1A]/50 max-w-[600px] mx-auto text-center">
            Every piece that leaves the studio begins in this conversation — between the growers
            our family has known for decades, the artisans who throw our ceramics by hand, and
            the room in front of us asking to feel a little more alive.
          </p>

          {/* Final statement */}
          <p
            className="mt-12 text-center font-display text-[clamp(1.3rem,3vw,2.25rem)] font-light italic text-[#1C1C1A]/55"
          >
            Crafted for permanence. Designed for distinction.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CHAPTER II — The Lineage
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#1C1C1A] text-[#F9F6F2] py-28 md:py-40 overflow-hidden">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-8">

          {/* Chapter header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20 md:mb-28"
          >
            <p className="font-body text-[9px] tracking-[0.28em] uppercase text-[#F9F6F2]/25 mb-5">
              Chapter II &nbsp;—&nbsp; The Lineage
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.02] mb-4">
              Four generations, one craft
            </h2>
            <p
              className="text-4xl md:text-5xl text-[#A06855]"
              style={{ fontFamily: 'var(--font-italianno), cursive' }}
            >
              la nostra eredità
            </p>
          </motion.div>

          {/* Timeline — connecting line + cards */}
          <div className="relative">

            {/* Horizontal connector line (desktop) */}
            <div className="hidden lg:block absolute top-[2.75rem] left-0 right-0 h-px bg-[#F9F6F2]/8" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-14 lg:gap-8">
              {GENERATIONS.map((gen, i) => (
                <motion.div
                  key={gen.numeral}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i}
                  className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  {/* Numeral + dot on line */}
                  <div className="relative mb-6">
                    {/* Dot on line */}
                    <div className="hidden lg:block absolute -top-[2.75rem] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#A06855] mt-[2.4rem]" />
                    <span className="font-display text-[4.5rem] md:text-[5.5rem] font-light leading-none text-[#F9F6F2]/6 select-none">
                      {gen.numeral}
                    </span>
                  </div>

                  {/* Year */}
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-[#A06855]/70 mb-4">
                    — {gen.year} —
                  </p>

                  {/* Name */}
                  <p className="font-display text-xl md:text-2xl font-light text-[#F9F6F2] leading-tight mb-5 whitespace-pre-line">
                    {gen.name}
                  </p>

                  <div className="w-8 h-px bg-[#A06855]/40 mb-5" />

                  {/* Body */}
                  <p className="font-body text-sm leading-[1.85] text-[#F9F6F2]/45">
                    {gen.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA Footer
      ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: 'Shop the Collection',
              body: 'Preserved rose arrangements for private clients. Ships across the United States.',
              href: '/shop',
              cta: 'Browse →',
            },
            {
              title: 'For Business',
              body: 'Hotels, restaurants, offices, events. Volume programs and custom commissions.',
              href: '/business',
              cta: 'Learn more →',
            },
            {
              title: 'Interiors',
              body: 'For interior designers and architects. Commission a piece designed to your brief.',
              href: '/interiors',
              cta: 'Learn more →',
            },
          ].map((item) => (
            <div key={item.href} className="border-t border-[#1C1C1A]/10 pt-8">
              <h3 className="font-display text-2xl font-light text-[#1C1C1A] mb-3">{item.title}</h3>
              <p className="font-body text-sm text-[#1C1C1A]/45 leading-[1.85] mb-6">{item.body}</p>
              <Link
                href={item.href}
                className="label-caps text-[#1C1C1A]/40 hover:text-[#1C1C1A] transition-colors duration-300"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

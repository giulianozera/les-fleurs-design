'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Animation helpers ─────────────────────────────────────────────────────────

function fadeUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  };
}

function fadeIn(delay = 0) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, delay, ease: 'easeOut' as const },
    },
  };
}

// ── Decorative rose ornament (reused from hero, scaled down) ──────────────────

function RoseOrnament() {
  return (
    <svg
      viewBox="-55 -55 110 110"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-14 h-14 opacity-30"
    >
      <defs>
        <path id="st-po" d="M0,0 C-11,-4 -16,-16 -9,-29 C-5,-36 5,-36 9,-29 C16,-16 11,-4 0,0 Z" transform="translate(0,-5)" />
        <path id="st-pm" d="M0,0 C-8,-3 -12,-12 -7,-22 C-4,-28 4,-28 7,-22 C12,-12 8,-3 0,0 Z" transform="translate(0,-3)" />
      </defs>
      <g>
        <use href="#st-po" fill="#A06855" /><use href="#st-po" fill="#8A6F47" transform="rotate(60)" />
        <use href="#st-po" fill="#A06855" transform="rotate(120)" /><use href="#st-po" fill="#8A6F47" transform="rotate(180)" />
        <use href="#st-po" fill="#A06855" transform="rotate(240)" /><use href="#st-po" fill="#8A6F47" transform="rotate(300)" />
      </g>
      <g transform="rotate(30)">
        <use href="#st-pm" fill="#7a6745" /><use href="#st-pm" fill="#968058" transform="rotate(60)" />
        <use href="#st-pm" fill="#7a6745" transform="rotate(120)" /><use href="#st-pm" fill="#968058" transform="rotate(180)" />
        <use href="#st-pm" fill="#7a6745" transform="rotate(240)" /><use href="#st-pm" fill="#968058" transform="rotate(300)" />
      </g>
      <circle r={5} fill="#4a3825" />
      <circle r={2} fill="#2a1f12" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function OurStory() {
  return (
    <section className="bg-ivory overflow-hidden">

      {/* ── Atmospheric image strip ─────────────────────────────────────────── */}
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(240px, 38vw, 560px)' }}
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Image
          src="/sfondo.jpg"
          alt="Les Fleurs Design — atelier"
          fill
          priority={false}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient veil — fades image into ivory at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-transparent to-ivory/80" />

        {/* Chapter badge — centred on the image */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          variants={fadeUp(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-gold/60" />
            <p className="label-caps text-charcoal/50 tracking-[0.22em]">Chapter I — The Story</p>
            <div className="h-px w-10 bg-gold/60" />
          </div>
          <p className="font-script text-[2.5rem] md:text-[3.5rem] leading-none text-rose">
            our story
          </p>
        </motion.div>
      </motion.div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28">

        {/* Display title */}
        <motion.div
          className="mb-16 md:mb-20"
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <RoseOrnament />
          </div>
          <h2 className="font-display text-[clamp(3rem,6.5vw,5.5rem)] font-light italic text-charcoal leading-[0.92]">
            A still life that lasts.
          </h2>
          <div className="h-px w-full bg-charcoal/8 mt-12" />
        </motion.div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-14 lg:gap-20">

          {/* ── Left column — story body ─────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {/* Lede — drop-cap */}
            <p className="story-lede font-display text-[1.2rem] md:text-[1.35rem] italic text-charcoal leading-[1.75] mb-8 overflow-hidden">
              My name is Matteo di Rosa, and I come from a family in Italy that has worked with flowers for four generations.
            </p>

            {/* Body paragraphs */}
            <div className="space-y-6 font-body text-sm text-warm-gray leading-[2]">
              <p>
                I was raised between the cutting rooms and the cold storage of my family&rsquo;s atelier — in a small corner of Italy where the mornings smelled of wet leaves and rose stems, and where my grandfather taught me that a single bloom, handled correctly, could carry an entire room. My father arranged the villas. My mother arranged the churches. The work was quiet, exact, and never temporary in spirit, even when the flowers themselves were.
              </p>

              <p>
                Les Fleurs Design is the form that inheritance takes here. I founded the studio to bring our family&rsquo;s craft — the patience, the obsession with material, the refusal to accept that beauty must be brief — into a new{' '}
                <em className="font-display not-italic" style={{ color: '#A06855' }}>language</em>.
                {' '}Real roses. Real ceramic. Real permanence.
              </p>

              <p>
                What we make today is the opposite of a cut bouquet. Roses preserved at peak bloom. Vessels hand-formed by independent artisans. Objects engineered to last a year on a console table, a hotel front desk, a dining room, a private suite. The flowers are still real — they have simply been given more time.
              </p>

              <p>
                I am carrying my family&rsquo;s{' '}
                <em className="font-display not-italic" style={{ color: '#A06855' }}>heritage</em>
                {' '}across an ocean. The atelier here is small, but the conversation is the same one we&rsquo;ve been having for a hundred years: how does one make beauty worth keeping?
              </p>
            </div>

            {/* Signature */}
            <div className="mt-14 pt-10 border-t border-charcoal/10">
              <p className="font-script text-[2.75rem] leading-none text-charcoal mb-2">
                Matteo di Rosa
              </p>
              <p className="label-caps text-warm-gray">— Founder &amp; Designer</p>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 label-caps text-charcoal/50 hover:text-charcoal transition-colors duration-300 group"
              >
                Read the full story
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </motion.div>

          {/* ── Right column — pull-quote aside ─────────────────────────── */}
          <motion.aside
            className="lg:border-l border-rose/30 lg:pl-14 flex flex-col gap-10"
            style={{ borderColor: '#A06855' }}
            variants={fadeUp(0.25)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {/* Pull-quote */}
            <div>
              <span
                className="font-display text-6xl leading-none select-none opacity-20"
                aria-hidden="true"
                style={{ color: '#A06855' }}
              >
                &ldquo;
              </span>
              <blockquote className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-light italic text-charcoal leading-[1.4] mt-1">
                A flower is never only a flower.{' '}
                <span style={{ color: '#A06855' }}>
                  It is a memory that quietly stays in the room.
                </span>
              </blockquote>
              <div className="mt-6">
                <p className="font-script text-xl" style={{ color: '#A06855' }}>
                  — a family saying
                </p>
                <p className="label-caps text-warm-gray mt-2 text-[9px] tracking-[0.22em]">
                  Passed Down Four Generations
                </p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="w-8 h-px bg-gold" />

            {/* Secondary paragraph */}
            <p className="font-body text-sm text-warm-gray leading-[2]">
              Every piece that leaves the studio begins in this conversation — between the growers our family has known for decades, the artisans who throw our ceramics by hand, and the room in front of us asking to feel a little more alive.
            </p>

            {/* Accent image — product close-up placeholder */}
            <div className="relative w-full overflow-hidden bg-ivory-dark" style={{ aspectRatio: '4/3' }}>
              {/* TODO: replace with close-up atelier / petal detail photo */}
              <div className="absolute inset-0 flex items-end p-4">
                <p className="label-caps text-charcoal/20 text-[9px]">
                  Atelier detail — coming soon
                </p>
              </div>
            </div>

            {/* Italic tagline */}
            <p
              className="font-display text-lg italic"
              style={{ color: '#A06855' }}
            >
              Crafted for permanence.
              <br />
              Designed for distinction.
            </p>
          </motion.aside>

        </div>
      </div>

    </section>
  );
}

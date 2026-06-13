'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' as const } },
};

export function OurStory() {
  return (
    <section className="relative bg-[#F9F6F2] overflow-hidden">
      {/* ── Atmospheric image strip ── */}
      <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
        <Image
          src="/sfondo.jpg"
          alt="Les Fleurs atelier — detail"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay: fades to section bg at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#F9F6F2]" />
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 lg:px-16 pb-28 md:pb-36 -mt-20 md:-mt-28 relative z-10">

        {/* Chapter badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-3 tracking-[0.22em] text-[10px] uppercase text-[#A06855]">
            {/* Rose ornament */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="4" fill="#A06855" fillOpacity="0.18" />
              <circle cx="11" cy="11" r="1.5" fill="#A06855" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="11"
                  cy="5"
                  rx="2"
                  ry="3.5"
                  fill="#A06855"
                  fillOpacity="0.55"
                  transform={`rotate(${deg} 11 11)`}
                />
              ))}
            </svg>
            Our Story
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light italic text-[#1C1C1A] leading-[1.08] mb-14 md:mb-20 max-w-[720px]"
        >
          Flowers that last.<br />
          A story worth telling.
        </motion.h2>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-14 lg:gap-20 items-start">

          {/* ── Left: prose ── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-7"
          >
            <p className="story-lede font-display text-lg md:text-xl leading-[1.7] text-[#1C1C1A]/85">
              A room with a flower in it is a room that cares about itself. That simple
              conviction sits behind everything Les Fleurs Design makes — beauty that does not
              have to fade by the end of the week.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.85] text-[#1C1C1A]/65">
              The studio was born from a simple frustration: the most beautiful flowers last
              days, while the most beautiful spaces deserve something that endures. So we work in
              preservation — the chemistry of glycerin and pigment, the geometry of ceramic
              glazes, the patience a single vessel demands. Every piece carries that same
              discipline.
            </p>

            <p className="font-body text-base md:text-[17px] leading-[1.85] text-[#1C1C1A]/65">
              Our roses are sourced from highland farms in Ecuador and Colombia, preserved using
              a process that replaces their natural sap with food-grade glycerin — leaving them
              soft to the touch, vivid in colour, and stable for over a year without water or
              sunlight. The ceramics are thrown by hand in small batches, glazed in palettes we
              develop in-house. Nothing is mass-produced. Everything is made to be noticed.
            </p>

            {/* Signature */}
            {/* TODO: owner to supply real founder name + title to sign this section. */}
            <div className="pt-6 border-t border-[#A06855]/20">
              <p
                className="font-script text-3xl text-[#A06855] mb-1"
                style={{ fontFamily: 'var(--font-italianno), cursive' }}
              >
                Les Fleurs Design
              </p>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-[#1C1C1A]/65">
                Miami, Florida
              </p>
            </div>
          </motion.div>

          {/* ── Right: pull-quote ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:pt-4 flex flex-col gap-10"
          >
            {/* Pull-quote card */}
            <blockquote className="relative pl-7 border-l-2 border-[#A06855]">
              <p className="font-display text-2xl md:text-3xl font-light italic leading-[1.45] text-[#1C1C1A]/80">
                &ldquo;A flower that lasts a year asks a different question than one that dies in a
                week. It asks: what is this space trying to say about itself?&rdquo;
              </p>
              <footer className="mt-5 font-body text-xs tracking-[0.15em] uppercase text-[#8a5440]">
                — Les Fleurs Design
              </footer>
            </blockquote>

            {/* Detail image placeholder (replace with atelier / petal close-up) */}
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[#E8E0D5]">
              {/* TODO: replace with close-up atelier / petal detail photo */}
              <div className="absolute inset-0 flex items-end p-6">
                <p className="font-body text-xs tracking-[0.12em] uppercase text-[#1C1C1A]/55">
                  Atelier detail — coming soon
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

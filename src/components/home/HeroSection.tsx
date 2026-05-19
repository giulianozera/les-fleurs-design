'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[640px] max-h-[960px] flex items-end overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1600x960/C8C0B4/0F0F0F?text=."
          alt="Les Fleurs Design — Preserved roses in ceramic vessel"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
        <motion.p
          className="label-caps text-ivory/60 mb-5"
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Maison Florale — Miami
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(3.75rem,9vw,7.5rem)] font-light text-ivory leading-[1.0] tracking-tight max-w-3xl"
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Not Just<br />For Her.
        </motion.h1>

        <motion.p
          className="font-display text-lg md:text-xl font-light italic text-ivory/70 mt-5 mb-10 max-w-lg leading-relaxed"
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          A design piece for hotels, restaurants, and the spaces that demand distinction — as much as it is a gift for the woman who deserves more than a bouquet.
        </motion.p>

        <motion.div
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Primary CTA */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-ivory text-charcoal px-8 py-4 label-caps hover:bg-stone hover:text-ivory transition-colors duration-500 group"
          >
            Shop the Collection
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-3 border border-ivory/50 text-ivory px-8 py-4 label-caps hover:border-ivory hover:bg-ivory/10 transition-all duration-500 group"
          >
            For Business
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="label-caps text-ivory/35 [writing-mode:vertical-rl]">Scroll</span>
        <div className="w-px h-10 bg-ivory/25 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-ivory/55"
            style={{ height: '40%' }}
            animate={{ y: ['0%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

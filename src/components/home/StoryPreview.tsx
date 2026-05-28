'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.16 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function StoryPreview() {
  return (
    <section className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">

          {/* Left — label + heading + teaser + CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p className="label-caps text-ivory/30 mb-6" variants={fadeUp}>
              Our Story
            </motion.p>
            <motion.h2
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light text-ivory leading-[0.95] mb-8"
              variants={fadeUp}
            >
              Built from a refusal to accept the temporary.
            </motion.h2>
            <motion.p
              className="font-body text-sm text-ivory/50 leading-[2] mb-10 max-w-[42ch]"
              variants={fadeUp}
            >
              {/* TODO: replace with real founder copy — 2–3 sentences, first-person */}
              Les Fleurs Design began with a single question: what does a gift look like one year after it is given? For most flowers, nothing. For ours — the same arrangement, colors intact, petals soft, structure unchanged.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 label-caps text-ivory/50 hover:text-ivory transition-colors duration-300 group"
              >
                Read Our Story
                <ArrowRight
                  size={11}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — pull quote */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="mt-16 lg:mt-0 border-l border-ivory/10 pl-10"
          >
            <span
              className="font-display text-7xl text-ivory/10 leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-light italic text-ivory/60 leading-[1.35] mt-2">
              {/* TODO: replace with a real founder quote */}
              Crafted for permanence.
              <br />
              Designed for distinction.
            </blockquote>
            <div className="mt-8 w-8 h-px bg-gold" />
            <p className="label-caps text-ivory/20 mt-4">
              {/* TODO: founder name / title */}
              Founder, Les Fleurs Design
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

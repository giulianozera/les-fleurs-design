'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    slug: 'eternal-edit',
    title: 'The Eternal Edit',
    description: 'Our most sought-after arrangements. Timeless forms, enduring beauty.',
  },
  {
    slug: 'maison',
    title: 'Maison Collection',
    description: 'Architectural vessels. Roses selected for their quietude.',
  },
  {
    slug: 'signature',
    title: 'The Signature Series',
    description: 'Our signature hand-formed ceramics. One-of-a-kind, never repeated.',
  },
];

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function FeaturedCollections() {
  return (
    <section className="py-24 md:py-32 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

      {/* Section header */}
      <motion.div
        className="flex items-end justify-between mb-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div>
          <motion.p className="label-caps text-charcoal/40 mb-3" variants={fadeUp}>
            Collections
          </motion.p>
          <motion.h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal" variants={fadeUp}>
            Curated with intention.
          </motion.h2>
        </div>
        <motion.div variants={fadeUp} className="hidden md:block">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300 group"
          >
            View All
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Collections grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        {collections.map((col) => (
          <motion.div key={col.slug} variants={fadeUp}>
            <Link href={`/shop?collection=${col.slug}`} className="group block">
              {/* Image container — 4:5 portrait */}
              <div className="relative w-full overflow-hidden bg-ivory-dark flex items-center justify-center" style={{ aspectRatio: '4/5' }}>
                <p className="label-caps text-charcoal/30 tracking-widest">Coming Soon</p>
              </div>
              {/* Caption */}
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-light text-charcoal group-hover:text-stone transition-colors duration-300">
                    {col.title}
                  </h3>
                  <p className="font-body text-sm text-charcoal/50 mt-1 max-w-xs">{col.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="mt-1 flex-shrink-0 text-charcoal/30 transition-all duration-300 group-hover:text-stone group-hover:translate-x-1"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile view all */}
      <div className="mt-10 md:hidden text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300"
        >
          View All Collections
          <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const pillars = [
  {
    number: '01',
    title: 'One-Year Bloom',
    body: 'Our roses are preserved at peak bloom using a proprietary process. No water. No care. Twelve months of quiet, unwavering beauty.',
  },
  {
    number: '02',
    title: 'Handcrafted Ceramics',
    body: 'Each vessel is hand-formed by independent artisans. Blue-and-white porcelain, matte black stoneware, raw travertine — no two are exactly alike.',
  },
  {
    number: '03',
    title: 'Crafted with Intention',
    body: 'We work only with ateliers that share our obsession with material and form. Every detail — petal, glaze, weight — is deliberate.',
  },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function WhySection() {
  return (
    <section className="bg-ivory-dark py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="mb-16 md:mb-20 max-w-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p className="label-caps text-charcoal/40 mb-3" variants={fadeUp}>
            Why Les Fleurs Design
          </motion.p>
          <motion.h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal leading-tight" variants={fadeUp}>
            Beauty that doesn&rsquo;t ask for attention.
          </motion.h2>
        </motion.div>

        {/* Three pillars */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.number} variants={fadeUp} className="relative">
              {/* Subtle divider line at top */}
              <div className="w-8 h-px bg-gold mb-8" />
              <p className="label-caps text-warm-gray mb-4">{pillar.number}</p>
              <h3 className="font-display text-2xl md:text-3xl font-light text-charcoal mb-4">
                {pillar.title}
              </h3>
              <p className="font-body text-sm leading-[1.8] text-charcoal/60">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

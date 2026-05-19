'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cards = [
  {
    id: 'for-her',
    title: 'For Her',
    body: 'A bloom that outlasts the moment.',
    image: 'https://placehold.co/600x750/EDE6DA/0F0F0F?text=.',
    href: '/shop',
    cta: 'Shop Gifts',
  },
  {
    id: 'for-hospitality',
    title: 'For Hospitality',
    body: 'Lobbies, suites, dining rooms. A signature that doesn’t wilt.',
    image: 'https://placehold.co/600x750/D4CEC6/0F0F0F?text=.',
    href: '/wholesale',
    cta: 'Partner With Us',
  },
  {
    id: 'for-retail',
    title: 'For Retail & Interiors',
    body: 'An object of design, available at wholesale.',
    image: 'https://placehold.co/600x750/C8C0B4/0F0F0F?text=.',
    href: '/wholesale',
    cta: 'Wholesale Inquiry',
  },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function BeyondTheGift() {
  return (
    <section className="py-24 md:py-32 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

      {/* Section header */}
      <motion.div
        className="mb-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.p className="label-caps text-warm-gray mb-3" variants={fadeUp}>
          Beyond the Gift
        </motion.p>
        <motion.h2
          className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal max-w-xl"
          variants={fadeUp}
        >
          One object. Many contexts.
        </motion.h2>
      </motion.div>

      {/* Three-column grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        {cards.map((card) => (
          <motion.div key={card.id} variants={fadeUp}>
            <Link href={card.href} className="group block">
              {/* 4:5 portrait image */}
              <div className="relative w-full overflow-hidden bg-ivory-dark" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-light text-charcoal mb-1.5">
                    {card.title}
                  </h3>
                  <p className="font-body text-sm text-warm-gray leading-relaxed">
                    {card.body}
                  </p>
                  <p className="label-caps text-charcoal/40 mt-3 inline-flex items-center gap-1.5 group-hover:text-charcoal transition-colors duration-300">
                    {card.cta}
                    <ArrowRight
                      size={10}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

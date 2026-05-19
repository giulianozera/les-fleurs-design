'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: 'The most beautiful object in my apartment. Guests always ask about it — and it still looks as perfect as the day it arrived.',
    author: 'Isabelle M.',
    location: 'New York, NY',
  },
  {
    id: 2,
    quote: 'We ordered twelve arrangements for our hotel lobby. The quality is extraordinary and they have required zero maintenance over eight months.',
    author: 'Laurent P.',
    location: 'Miami, FL',
  },
  {
    id: 3,
    quote: 'A single bloom. Exactly as described. The ceramic vessel is a work of art in its own right. I ordered three more as gifts.',
    author: 'Claire S.',
    location: 'Los Angeles, CA',
  },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function Testimonials() {
  return (
    <section className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p className="label-caps text-ivory/30 mb-3" variants={fadeUp}>
            What Our Clients Say
          </motion.p>
          <motion.h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-ivory" variants={fadeUp}>
            In their own words.
          </motion.h2>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="border-t border-ivory/10 pt-8"
            >
              {/* Quote mark */}
              <span className="font-display text-5xl text-warm-gray/40 leading-none select-none">&ldquo;</span>
              <p className="font-display text-xl md:text-2xl font-light italic text-ivory/80 leading-relaxed mt-1 mb-6">
                {t.quote}
              </p>
              <div>
                <p className="font-body text-sm font-medium text-ivory">{t.author}</p>
                <p className="label-caps text-ivory/30 mt-1">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

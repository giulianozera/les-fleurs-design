'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const SLIDES = [
  {
    src: '/business/private member club .png',
    caption: "Private Members' Club",
    alt: "Private members' club floral arrangement",
  },
  {
    src: '/business/restourant table.jpg',
    caption: 'Restaurant',
    alt: 'Restaurant table arrangement',
  },
  {
    src: '/business/event inistallation.JPG',
    caption: 'Event Installation',
    alt: 'Event floral installation',
  },
  {
    src: '/business/hotel lobby.jpg',
    caption: 'Hotel Lobby',
    alt: 'Hotel lobby installation',
  },
  {
    src: '/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg',
    caption: 'Suite Amenity',
    alt: 'Suite amenity — blue porcelain vessel',
  },
  {
    src: '/business/corporate .png',
    caption: 'Corporate Reception',
    alt: 'Corporate reception arrangement',
  },
];

const SLIDE_DURATION = 5000; // ms between auto-advance

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.65, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] } },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] } }),
};

export function BusinessCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number, dir?: number) => {
      const d = dir ?? (index > current ? 1 : -1);
      setDirection(d);
      setCurrent((index + SLIDES.length) % SLIDES.length);
    },
    [current],
  );

  const prev = () => goTo(current - 1, -1);
  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(id);
  }, [current, paused, next]);

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Image stage ── */}
      <div className="relative w-full h-[440px] md:h-[620px] overflow-hidden bg-[#1C1C1A]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={current === 0}
            />
            {/* Bottom gradient for caption legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* ── Caption overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 flex items-end justify-between z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
              className="flex items-center gap-4"
            >
              <div className="w-5 h-px bg-[#A06855]" />
              <p className="font-body text-[11px] tracking-[0.22em] uppercase text-white/80">
                {SLIDES[current].caption}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide counter */}
          <p className="font-body text-[10px] tracking-[0.18em] text-white/35">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>
        </div>

        {/* ── Arrow buttons ── */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-colors duration-200 group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#A06855] transition-colors duration-200" />
          </svg>
        </button>

        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-colors duration-200 group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#A06855] transition-colors duration-200" />
          </svg>
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex items-center justify-center gap-2.5 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group p-1"
          >
            <div
              className={`h-px transition-all duration-400 ${
                i === current
                  ? 'w-8 bg-[#A06855]'
                  : 'w-4 bg-charcoal/20 group-hover:bg-charcoal/40'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

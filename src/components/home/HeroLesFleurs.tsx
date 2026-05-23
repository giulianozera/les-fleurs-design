'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

// ── Palette ──────────────────────────────────────────────────────────────────
const PETAL_COLORS = [
  '#f0e4d0',
  '#e8dbc0',
  '#d6c298',
  '#b8a07a',
  '#f5ebd8',
  '#ddc89e',
] as const;


// ── Petal data ────────────────────────────────────────────────────────────────
interface Petal {
  id: number;
  left: number;
  dx: number;
  duration: number;
  delay: number;
  width: number;
  height: number;
  color: string;
}

// Generated once at module load — decorative, stable across re-renders
const FALLING_PETALS: Petal[] = Array.from({ length: 8 }, (_, i) => {
  const size = 0.7 + Math.random() * 0.6;
  return {
    id: i,
    left: Math.random() * 100,
    dx: (Math.random() - 0.5) * 120,
    duration: 18 + Math.random() * 10,
    delay: Math.random() * 12,
    width: Math.round(12 * size),
    height: Math.round(16 * size),
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  };
});

// ── Variant factories ─────────────────────────────────────────────────────────
function bloomVariant(delay: number, duration: number) {
  return {
    hidden: { scale: 0.4, rotate: -20, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };
}

function fadeUpVariant(delay: number, duration = 1.5) {
  return {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: 'easeOut' as const },
    },
  };
}

// ── Petal component ───────────────────────────────────────────────────────────
function FallingPetal({ petal }: { petal: Petal }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute top-[-40px] pointer-events-none"
      style={{
        left: `${petal.left}%`,
        width: petal.width,
        height: petal.height,
        borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
        backgroundColor: petal.color,
      }}
      animate={{
        y: ['0vh', '110vh'],
        x: [0, petal.dx],
        rotate: [0, 360],
        opacity: [0, 0.45, 0.45, 0],
      }}
      transition={{
        duration: petal.duration,
        repeat: Infinity,
        delay: petal.delay,
        ease: 'linear',
        opacity: {
          duration: petal.duration,
          repeat: Infinity,
          delay: petal.delay,
          ease: 'linear',
          times: [0, 0.1, 0.9, 1],
        },
      }}
    />
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface HeroProps {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  scrollHintLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function HeroLesFleurs({
  eyebrow = 'Maison Florale — Miami',
  headline = 'Not Just For Her.',
  subhead = 'A design piece for hotels, restaurants, and the spaces that demand distinction — as much as it is a gift for the woman who deserves more than a bouquet.',
  primaryCtaLabel = 'Shop the Collection',
  primaryCtaHref = '/shop',
  secondaryCtaLabel = 'For Business',
  secondaryCtaHref = '/wholesale',
  scrollHintLabel = 'Scroll',
}: HeroProps) {
  const reducedMotion = useReducedMotion();

  const initial = reducedMotion ? 'visible' : 'hidden';

  return (
    <section
      className="relative h-screen overflow-hidden flex flex-col items-center justify-center px-[5vw] bg-[radial-gradient(ellipse_at_center_top,#faf2e0_0%,#ebdfc4_60%,#ddcdb0_100%)]"
    >
      {/* Eyebrow — absolutely anchored at top, first thing visible */}
      <motion.p
        className="absolute top-[8vh] left-0 right-0 text-center font-body text-[11px] sm:text-[10px] tracking-[0.45em] sm:tracking-[0.35em] uppercase text-[#5a4530]"
        variants={fadeUpVariant(0.3, 1.2)}
        initial={initial}
        animate="visible"
      >
        {eyebrow}
      </motion.p>

      {/* Sparse drifting petals */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {FALLING_PETALS.map((p) => (
            <FallingPetal key={p.id} petal={p} />
          ))}
        </div>
      )}

      {/* SVG Rose — ornamental mark above the headline */}
      <div
        aria-hidden="true"
        className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] mb-[2.5vh] shrink-0"
      >
        <svg
          viewBox="-110 -110 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <path
              id="lf-po"
              d="M0,0 C-22,-8 -32,-32 -18,-58 C-10,-72 10,-72 18,-58 C32,-32 22,-8 0,0 Z"
              transform="translate(0,-10)"
            />
            <path
              id="lf-pm"
              d="M0,0 C-18,-6 -26,-26 -14,-46 C-8,-56 8,-56 14,-46 C26,-26 18,-6 0,0 Z"
              transform="translate(0,-6)"
            />
            <path
              id="lf-pi"
              d="M0,0 C-14,-4 -20,-20 -10,-34 C-5,-42 5,-42 10,-34 C20,-20 14,-4 0,0 Z"
              transform="translate(0,-4)"
            />
          </defs>

          {/* Outer ring — palest cream */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            variants={bloomVariant(0.3, 2.0)}
            initial={initial}
            animate="visible"
          >
            <use href="#lf-po" fill="#f5ebd8" />
            <use href="#lf-po" fill="#ecdfc2" transform="rotate(60)" />
            <use href="#lf-po" fill="#f5ebd8" transform="rotate(120)" />
            <use href="#lf-po" fill="#ecdfc2" transform="rotate(180)" />
            <use href="#lf-po" fill="#f5ebd8" transform="rotate(240)" />
            <use href="#lf-po" fill="#ecdfc2" transform="rotate(300)" />
          </motion.g>

          {/* Middle ring — light champagne, static 30° offset via SVG wrapper */}
          <g transform="rotate(30)">
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              variants={bloomVariant(0.7, 1.8)}
              initial={initial}
              animate="visible"
            >
              <use href="#lf-pm" fill="#d6c298" />
              <use href="#lf-pm" fill="#c2ad7d" transform="rotate(60)" />
              <use href="#lf-pm" fill="#d6c298" transform="rotate(120)" />
              <use href="#lf-pm" fill="#c2ad7d" transform="rotate(180)" />
              <use href="#lf-pm" fill="#d6c298" transform="rotate(240)" />
              <use href="#lf-pm" fill="#c2ad7d" transform="rotate(300)" />
            </motion.g>
          </g>

          {/* Inner ring — darker champagne */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            variants={bloomVariant(1.1, 1.6)}
            initial={initial}
            animate="visible"
          >
            <use href="#lf-pi" fill="#968058" />
            <use href="#lf-pi" fill="#7a6745" transform="rotate(72)" />
            <use href="#lf-pi" fill="#968058" transform="rotate(144)" />
            <use href="#lf-pi" fill="#7a6745" transform="rotate(216)" />
            <use href="#lf-pi" fill="#968058" transform="rotate(288)" />
          </motion.g>

          {/* Center — deep warm brown */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            variants={bloomVariant(1.5, 1.2)}
            initial={initial}
            animate="visible"
          >
            <circle r={8} fill="#4a3825" />
            <circle r={3} fill="#2a1f12" />
          </motion.g>
        </svg>
      </div>

      {/* Wordmark logo */}
      <motion.div
        className="mb-[2.5vh]"
        variants={fadeUpVariant(2.0)}
        initial={initial}
        animate="visible"
      >
        <Image
          src="/les-fleurs-logo.png"
          alt="Les Fleurs"
          width={1254}
          height={315}
          priority
          className="w-full max-w-[880px] h-auto mx-auto drop-shadow-[0_4px_24px_rgba(42,31,18,0.06)]"
        />
      </motion.div>

      {/* Subhead */}
      <motion.p
        className="font-display font-light text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-[#5a4530] text-center max-w-[56ch] mb-[4vh]"
        variants={fadeUpVariant(2.6)}
        initial={initial}
        animate="visible"
      >
        {subhead}
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-3.5"
        variants={fadeUpVariant(3.2)}
        initial={initial}
        animate="visible"
      >
        <Link
          href={primaryCtaHref}
          className="inline-block px-8 py-3.5 font-body text-[11px] font-normal tracking-[0.3em] uppercase text-[#f4ead6] bg-[#2a1f12] border border-[#2a1f12] transition-colors duration-[400ms] hover:bg-[#1a1208] hover:border-[#1a1208]"
        >
          {primaryCtaLabel}
        </Link>
        <Link
          href={secondaryCtaHref}
          className="inline-block px-8 py-3.5 font-body text-[11px] font-normal tracking-[0.3em] uppercase text-[#2a1f12] bg-transparent border border-[#2a1f12] transition-colors duration-[400ms] hover:bg-[#2a1f12] hover:text-[#f4ead6]"
        >
          {secondaryCtaLabel}
        </Link>
      </motion.div>

      {/* Scroll hint — hidden on mobile */}
      <motion.div
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        variants={fadeUpVariant(3.8)}
        initial={initial}
        animate="visible"
      >
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#8a7a5e]">
          {scrollHintLabel}
        </span>
        <div className="w-px h-7 bg-[#8a7a5e] opacity-50" />
      </motion.div>
    </section>
  );
}

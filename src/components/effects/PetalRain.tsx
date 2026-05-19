'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// ── Petal assets ──────────────────────────────────────────────────────────────

const COLORS = [
  '#F5DADA', // soft blush
  '#EAC4C4', // medium blush
  '#F7EEE8', // ivory
  '#E0B5B5', // deeper rose
  '#EDE6DA', // brand ivory
  '#F2D5D0', // warm pink
];

// viewBox "0 0 16 24" petal paths — organic leaf/petal silhouettes
const PATHS = [
  'M8 0C11 5 13 12 11 18C9 24 3 24 1 19C-1 13 3 6 8 0Z',
  'M8 0C12 4 14 12 11 18C8 24 2 23 1 18C0 12 3 5 8 0Z',
  'M8 0C10 6 11 13 9 19C7 24 3 24 2 19C1 13 4 6 8 0Z',
];

let uid = 0;

interface Petal {
  id: number;
  x: number;       // vw %
  size: number;    // px width
  duration: number;// ms
  delay: number;   // ms
  color: string;
  path: string;
  rot: number;     // initial rotation deg
}

function makePetal(x?: number): Petal {
  return {
    id: uid++,
    x: x ?? 2 + Math.random() * 96,
    size: 9 + Math.random() * 9,
    duration: 3800 + Math.random() * 3200,
    delay: Math.random() * 900,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    path: PATHS[Math.floor(Math.random() * PATHS.length)],
    rot: Math.random() * 360,
  };
}

function burst(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => {
    // Spread evenly across width with small random offset
    const base = (i / count) * 92 + 4;
    return makePetal(base + (Math.random() * 6 - 3));
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

const MAX_PETALS = 60;

export function PetalRain() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const pathname = usePathname();
  const firstRender = useRef(true);
  const lastScroll = useRef(0);
  const throttle = useRef(false);

  const add = useCallback((newOnes: Petal[]) => {
    setPetals((prev) => [...prev, ...newOnes].slice(-MAX_PETALS));
  }, []);

  const remove = useCallback((id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Page-transition burst
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    add(burst(isMobile ? 12 : 22));
  }, [pathname, add]);

  // Scroll petals
  useEffect(() => {
    function onScroll() {
      const delta = Math.abs(window.scrollY - lastScroll.current);
      lastScroll.current = window.scrollY;
      if (delta < 40 || throttle.current) return;
      throttle.current = true;
      setTimeout(() => { throttle.current = false; }, 700);
      if (Math.random() > 0.35) add([makePetal()]);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [add]);

  if (petals.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9997 }}
      aria-hidden
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 1.5,
            animationName: 'petalFall',
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
          }}
          onAnimationEnd={() => remove(p.id)}
        >
          <svg
            viewBox="0 0 16 24"
            style={{ width: '100%', height: '100%', transform: `rotate(${p.rot}deg)` }}
            fill={p.color}
          >
            <path d={p.path} />
          </svg>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';

export interface PrototypeSlide {
  /** When omitted, the slide renders as a labelled placeholder (for prototypes not yet shot). */
  src?: string;
  alt?: string;
  caption: string;
  /** Aspect ratio, e.g. '16/9' or '3/4' — drives the mixed editorial look. */
  ratio: string;
}

/**
 * Editorial, mixed-ratio carousel. Native horizontal scroll-snap = free touch
 * swipe on mobile; arrow buttons + arrow keys for pointer/keyboard. Slides keep
 * their own aspect ratio against a shared height, so 16:9 and 3:4 sit side by side.
 */
export function PrototypeCarousel({
  slides,
  ariaLabel = 'Project prototypes',
}: {
  slides: PrototypeSlide[];
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges, slides.length]);

  const scrollByDir = useCallback((dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 320), behavior: 'smooth' });
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByDir(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByDir(-1);
    }
  }

  return (
    <div
      className="relative focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal/30"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Scroll track — native snap handles touch swipe */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <figure
            key={`${s.caption}-${i}`}
            className="snap-start shrink-0 group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.caption}`}
          >
            <div
              className="relative h-[300px] md:h-[460px] overflow-hidden bg-ivory-dark"
              style={{ aspectRatio: s.ratio }}
            >
              {s.src ? (
                <Image
                  src={s.src}
                  alt={s.alt ?? s.caption}
                  fill
                  sizes="(max-width: 768px) 80vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="label-caps text-charcoal/25 text-[9px]">{s.caption}</p>
                </div>
              )}
            </div>
            <figcaption className="mt-3.5 flex items-center gap-3">
              <div className="w-5 h-px bg-gold/70 shrink-0" />
              <p className="font-body text-[11px] tracking-[0.18em] uppercase text-charcoal/70">
                {s.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Arrows — vertically centred on the image band */}
      <button
        type="button"
        onClick={() => scrollByDir(-1)}
        disabled={atStart}
        aria-label="Previous"
        className="hidden sm:flex absolute left-3 top-[150px] md:top-[230px] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-charcoal/15 bg-ivory/80 backdrop-blur-sm hover:bg-ivory transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollByDir(1)}
        disabled={atEnd}
        aria-label="Next"
        className="hidden sm:flex absolute right-3 top-[150px] md:top-[230px] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-charcoal/15 bg-ivory/80 backdrop-blur-sm hover:bg-ivory transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal" />
        </svg>
      </button>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface SliderImage {
  url: string;
  alt: string;
}

export function ForHerSlider({ images }: { images: SliderImage[] }) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || images.length <= 1) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % images.length);
    }, 7000);
    return () => clearInterval(id);
  }, [reducedMotion, paused, images.length]);

  if (!images.length) {
    return <p className="label-caps text-charcoal/55 tracking-widest">Coming Soon</p>;
  }

  const canPause = !reducedMotion && images.length > 1;

  return (
    // Explicit positioned wrapper so `fill` images have a proper anchor
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <Image
          key={img.url}
          src={img.url}
          alt={i === index ? img.alt : ''}
          aria-hidden={i === index ? undefined : true}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Pause / play control for the auto-advancing slideshow (WCAG 2.2.2) */}
      {canPause && (
        <button
          type="button"
          onClick={(e) => {
            // Card is wrapped in a Link; don't navigate when toggling playback.
            e.preventDefault();
            e.stopPropagation();
            setPaused((p) => !p);
          }}
          aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          aria-pressed={paused}
          className="absolute bottom-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center bg-charcoal/55 text-ivory backdrop-blur-sm opacity-0 hover:bg-charcoal/75 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        >
          {paused ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <path d="M2 1l6 4-6 4z" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="2.2" height="8" />
              <rect x="5.8" y="1" width="2.2" height="8" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

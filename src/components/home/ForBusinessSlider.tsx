'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Design concept visualizations of preserved-rose pieces in different space types —
// not photographs of real, completed client installations.
// TODO: replace concept renders containing fabricated third-party brand signage
// (AURUM HOLDINGS / THE EMPEROR) baked into the image files with original imagery.
const IMAGES = [
  { src: '/business/private member club .png',  alt: "Design concept: private members' club setting" },
  { src: '/business/restourant table.jpg',       alt: 'Design concept: restaurant arrangement' },
  { src: '/business/event inistallation.JPG',    alt: 'Design concept: event installation' },
  { src: '/business/hotel lobby.jpg',            alt: 'Design concept: hotel lobby setting' },
  { src: '/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg', alt: 'Design concept: suite amenity' },
  { src: '/business/corporate .png',             alt: 'Design concept: corporate reception setting' },
];

export function ForBusinessSlider() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reducedMotion, paused]);

  const canPause = !reducedMotion;

  return (
    <div className="absolute inset-0">
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={i === index ? img.alt : ''}
          aria-hidden={i === index ? undefined : true}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          preload={i === 0}
          className={`object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
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

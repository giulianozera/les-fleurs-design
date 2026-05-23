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

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion || images.length <= 1) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % images.length);
    }, 7000);
    return () => clearInterval(id);
  }, [reducedMotion, images.length]);

  if (!images.length) {
    return <p className="label-caps text-charcoal/30 tracking-widest">Coming Soon</p>;
  }

  return (
    // Explicit positioned wrapper so `fill` images have a proper anchor
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <Image
          key={img.url}
          src={img.url}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

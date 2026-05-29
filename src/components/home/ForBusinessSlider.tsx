'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const IMAGES = [
  { src: '/business/private member club .png',  alt: "Private members' club" },
  { src: '/business/restourant table.jpg',       alt: 'Restaurant arrangement' },
  { src: '/business/event inistallation.JPG',    alt: 'Event installation' },
  { src: '/business/hotel lobby.jpg',            alt: 'Hotel lobby' },
  { src: '/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg', alt: 'Suite amenity' },
  { src: '/business/corporate .png',             alt: 'Corporate reception' },
];

export function ForBusinessSlider() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0">
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

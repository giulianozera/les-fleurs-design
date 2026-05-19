'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { SanityImageData } from '@/sanity/types';

interface ProductGalleryProps {
  images: SanityImageData[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — 4:5 portrait */}
      <div
        className="relative w-full overflow-hidden bg-ivory-dark"
        style={{ aspectRatio: '4/5' }}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt ?? title}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img._key ?? i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-16 overflow-hidden bg-ivory-dark transition-all duration-200',
                'focus:outline-none',
                i === activeIndex
                  ? 'ring-1 ring-charcoal ring-offset-1'
                  : 'opacity-50 hover:opacity-80',
              )}
              style={{ aspectRatio: '4/5' }}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${title} — image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

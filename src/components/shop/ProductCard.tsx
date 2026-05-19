'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductSummary } from '@/sanity/types';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.images[0];
  const hoverImage = product.images[1] ?? product.images[0];

  if (!primaryImage) return null;

  return (
    <Link
      href={`/shop/${product.slug.current}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — 4:5 portrait */}
      <div
        className="relative w-full overflow-hidden bg-ivory-dark"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Primary image */}
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt ?? product.title}
          fill
          className={`object-cover absolute inset-0 transition-opacity duration-700 ${
            hovered ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Hover image */}
        <Image
          src={hoverImage.url}
          alt={`${product.title} — alternate view`}
          fill
          className={`object-cover absolute inset-0 transition-opacity duration-700 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Quick-add overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-charcoal/90 backdrop-blur-sm py-3 transition-transform duration-500 ${
            hovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <p className="label-caps text-ivory text-center">View Product</p>
        </div>
      </div>

      {/* Card info */}
      <div className="mt-3 px-0.5">
        {product.collection && (
          <p className="label-caps text-warm-gray mb-1">{product.collection.title}</p>
        )}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.125rem] font-light text-charcoal group-hover:text-stone transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
          <p className="label-caps text-charcoal/70 flex-shrink-0 mt-0.5">
            ${product.basePrice.toLocaleString()}
          </p>
        </div>
        {/* Color swatches */}
        {product.roseColors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.roseColors.slice(0, 6).map((color) => (
              <span
                key={color._id}
                className="w-3 h-3 rounded-full border border-charcoal/10 flex-shrink-0"
                style={{ backgroundColor: color.hexValue }}
                title={color.name}
              />
            ))}
            {product.roseColors.length > 6 && (
              <span className="label-caps text-warm-gray">+{product.roseColors.length - 6}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

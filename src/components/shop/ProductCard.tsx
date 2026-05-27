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

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — 4:5 portrait */}
      <Link href={`/shop/${product.slug.current}`} className="block">
        <div
          className="relative w-full overflow-hidden bg-ivory-dark"
          style={{ aspectRatio: '4/5' }}
        >
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.title}
                fill
                className={`object-cover absolute inset-0 transition-opacity duration-700 ${
                  hovered ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <Image
                src={hoverImage.url}
                alt={`${product.title} — alternate view`}
                fill
                className={`object-cover absolute inset-0 transition-opacity duration-700 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#EDE6DA]">
              <span className="label-caps text-warm-gray text-xs">No image</span>
            </div>
          )}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-charcoal/90 backdrop-blur-sm py-3 transition-transform duration-500 ${
              hovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <p className="label-caps text-ivory text-center">View Product</p>
          </div>
        </div>
      </Link>

      {/* Card info */}
      <div className="mt-3 px-0.5">
        {product.collection && (
          <p className="label-caps text-warm-gray mb-1">{product.collection.title}</p>
        )}
        <Link href={`/shop/${product.slug.current}`} className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.125rem] font-light text-charcoal group-hover:text-stone transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
          <p className="label-caps text-charcoal/70 flex-shrink-0 mt-0.5">
            ${product.basePrice.toLocaleString()}
          </p>
        </Link>
        {/* Color swatches */}
        {product.colorVariants.length > 0 ? (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colorVariants.slice(0, 6).map((v) => (
              <Link
                key={v.colorId}
                href={`/shop/${v.productSlug}`}
                className="w-3 h-3 rounded-full border border-charcoal/10 flex-shrink-0 hover:scale-125 transition-transform duration-200"
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
                aria-label={`${product.title} in ${v.colorName}`}
              />
            ))}
            {product.colorVariants.length > 6 && (
              <span className="label-caps text-warm-gray">+{product.colorVariants.length - 6}</span>
            )}
          </div>
        ) : product.roseColors.length > 0 ? (
          <div className="flex items-center gap-1.5 mt-2">
            {product.roseColors.slice(0, 6).map((color) => (
              <Link
                key={color._id}
                href={`/shop/${product.slug.current}?color=${color.slug.current}`}
                className="w-3 h-3 rounded-full border border-charcoal/10 flex-shrink-0 hover:scale-125 transition-transform duration-200"
                style={{ backgroundColor: color.hexValue }}
                title={color.name}
                aria-label={`${product.title} in ${color.name}`}
              />
            ))}
            {product.roseColors.length > 6 && (
              <span className="label-caps text-warm-gray">+{product.roseColors.length - 6}</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

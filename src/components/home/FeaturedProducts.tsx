'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Product {
  slug: string;
  name: string;
  price: number;
  primaryImage: string;
  hoverImage: string;
  collection: string;
}

// Placeholder products — replaced with Sanity data in Phase 2
const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    slug: 'ivory-dome-porcelain',
    name: 'Ivory Dome in Blue Porcelain',
    price: 195,
    primaryImage: 'https://placehold.co/600x750/EDE6DA/0F0F0F?text=.',
    hoverImage: 'https://placehold.co/600x750/D4CEC6/0F0F0F?text=.',
    collection: 'Maison Collection',
  },
  {
    slug: 'white-matte-black',
    name: 'White Roses in Matte Black',
    price: 240,
    primaryImage: 'https://placehold.co/600x750/C8C0B4/0F0F0F?text=.',
    hoverImage: 'https://placehold.co/600x750/EDE6DA/0F0F0F?text=.',
    collection: 'The Eternal Edit',
  },
  {
    slug: 'champagne-travertine',
    name: 'Champagne Roses on Travertine',
    price: 320,
    primaryImage: 'https://placehold.co/600x750/F5F0E6/0F0F0F?text=.',
    hoverImage: 'https://placehold.co/600x750/D4CEC6/0F0F0F?text=.',
    collection: 'The Signature Series',
  },
  {
    slug: 'white-grand-dome',
    name: 'White Grand Dome',
    price: 480,
    primaryImage: 'https://placehold.co/600x750/F5F0E6/0F0F0F?text=.',
    hoverImage: 'https://placehold.co/600x750/C8C0B4/0F0F0F?text=.',
    collection: 'The Signature Series',
  },
];

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — 4:5 portrait */}
      <div className="relative w-full overflow-hidden bg-ivory-dark flex items-center justify-center" style={{ aspectRatio: '4/5' }}>
        <p className="label-caps text-charcoal/30 tracking-widest">Coming Soon</p>
      </div>

      {/* Product info */}
      <div className="mt-3 px-0.5">
        <p className="label-caps text-charcoal/40 mb-1">{product.collection}</p>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-light text-charcoal group-hover:text-stone transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
          <p className="label-caps text-charcoal/70 flex-shrink-0 mt-1">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

const stagger = {
  visible: { transition: { staggerChildren: 0.10 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function FeaturedProducts() {
  return (
    <section className="py-24 md:py-32 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

      {/* Section header */}
      <motion.div
        className="flex items-end justify-between mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div>
          <motion.p className="label-caps text-charcoal/40 mb-3" variants={fadeUp}>
            Featured
          </motion.p>
          <motion.h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-charcoal" variants={fadeUp}>
            Selected works.
          </motion.h2>
        </div>
        <motion.div variants={fadeUp} className="hidden md:block">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300 group"
          >
            View All Products
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Product grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        {PLACEHOLDER_PRODUCTS.map((product) => (
          <motion.div key={product.slug} variants={fadeUp}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile view all */}
      <div className="mt-10 md:hidden text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300"
        >
          View All Products
          <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}

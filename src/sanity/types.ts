// TypeScript types mirroring the Sanity schema documents.
// These are the shapes returned by GROQ queries (after projection + reference resolution).

export interface HomepageHero {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  scrollHintLabel: string;
}

export interface SanitySlug {
  current: string;
}

export interface SanityImageData {
  _key?: string;
  alt?: string;
  url: string;
  dimensions?: { width: number; height: number };
}

export interface ColorOption {
  _id: string;
  name: string;
  slug: SanitySlug;
  hexValue: string;
  available: boolean;
}

export interface PotOption {
  _id: string;
  name: string;
  slug: SanitySlug;
  description: string;
  available: boolean;
  imageUrl?: string;
}

export interface CollectionRef {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export interface Collection extends CollectionRef {
  description: string;
  imageUrl?: string;
  order: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ColorVariant {
  colorId: string;
  colorName: string;
  colorSlug: string;
  colorHex: string;
  productSlug: string;
}

/** Lightweight shape used in shop grid / cards */
export interface ProductSummary {
  _id: string;
  title: string;
  slug: SanitySlug;
  basePrice: number;
  stockQuantity: number;
  featured: boolean;
  images: SanityImageData[];
  collection: CollectionRef | null;
  roseColors: ColorOption[];
  colorVariants: ColorVariant[];
}

/** Full shape used on the product detail page */
export interface Product extends ProductSummary {
  description: string;
  weightGrams: number;
  dimensions: ProductDimensions;
  careInstructions: string[];
  potOptions: PotOption[];
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  location: string;
  featured: boolean;
  order: number;
}

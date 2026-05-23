import { groq } from 'next-sanity';
import { sanityClient, isSanityConfigured } from './client';
import type {
  Product,
  ProductSummary,
  Collection,
  Testimonial,
  HomepageHero,
} from './types';

// ── Shared fragments ──────────────────────────────────────────────────────────

const IMAGE_FIELDS = groq`
  _key,
  alt,
  "url": asset->url,
  "dimensions": asset->metadata.dimensions
`;

const PRODUCT_SUMMARY_FIELDS = groq`
  _id,
  title,
  slug,
  basePrice,
  stockQuantity,
  featured,
  "images": coalesce(images[0..1]{ ${IMAGE_FIELDS} }, []),
  "collection": collection->{ _id, title, slug },
  "roseColors": coalesce(roseColors[]->{ _id, name, slug, hexValue, available }, []),
  "colorVariants": coalesce(colorVariants[]{
    "colorId": color->_id,
    "colorName": color->name,
    "colorSlug": color->slug.current,
    "colorHex": color->hexValue,
    "productSlug": product->slug.current,
  }, []),
`;

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return fallback;
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getAllProducts(params?: {
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductSummary[]> {
  const query = groq`
    *[_type == "product"
      && (!defined($collection) || collection->slug.current == $collection)
      && basePrice >= $minPrice
      && basePrice <= $maxPrice
    ] | order(featured desc, _createdAt desc) {
      ${PRODUCT_SUMMARY_FIELDS}
    }
  `;
  return safeFetch<ProductSummary[]>(query, {
    collection: params?.collection ?? null,
    minPrice: params?.minPrice ?? 0,
    maxPrice: params?.maxPrice ?? 999999,
  }, []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = groq`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      basePrice,
      stockQuantity,
      weightGrams,
      dimensions,
      featured,
      careInstructions,
      "images": coalesce(images[]{ ${IMAGE_FIELDS} }, []),
      "collection": collection->{ _id, title, slug },
      "roseColors": coalesce(roseColors[]->{ _id, name, slug, hexValue, available }, []),
      "potOptions": coalesce(potOptions[]->{ _id, name, slug, description, available, "imageUrl": image.asset->url }, []),
      "colorVariants": coalesce(colorVariants[]{
        "colorId": color->_id,
        "colorName": color->name,
        "colorSlug": color->slug.current,
        "colorHex": color->hexValue,
        "productSlug": product->slug.current,
      }, []),
    }
  `;
  return safeFetch<Product | null>(query, { slug }, null);
}

export async function getRelatedProducts(
  collectionId: string,
  excludeId: string,
): Promise<ProductSummary[]> {
  const query = groq`
    *[_type == "product" && collection._ref == $collectionId && _id != $excludeId][0..3] {
      ${PRODUCT_SUMMARY_FIELDS}
    }
  `;
  return safeFetch<ProductSummary[]>(query, { collectionId, excludeId }, []);
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  const query = groq`
    *[_type == "product" && featured == true] | order(_createdAt desc) [0..3] {
      ${PRODUCT_SUMMARY_FIELDS}
    }
  `;
  return safeFetch<ProductSummary[]>(query, {}, []);
}

// ── Collections ───────────────────────────────────────────────────────────────

export async function getAllCollections(): Promise<Collection[]> {
  const query = groq`
    *[_type == "collection"] | order(order asc) {
      _id,
      title,
      slug,
      description,
      "imageUrl": image.asset->url,
      order,
    }
  `;
  return safeFetch<Collection[]>(query, {}, []);
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const query = groq`
    *[_type == "testimonial" && featured == true] | order(order asc) [0..2] {
      _id, quote, author, location, featured, order
    }
  `;
  return safeFetch<Testimonial[]>(query, {}, []);
}

// ── Homepage Hero ─────────────────────────────────────────────────────────────

const HERO_DEFAULTS: HomepageHero = {
  eyebrow: 'Maison Florale — Miami',
  headline: 'Not Just For Her.',
  subhead:
    'A design piece for hotels, restaurants, and the spaces that demand distinction — as much as it is a gift for the woman who deserves more than a bouquet.',
  primaryCtaLabel: 'Shop the Collection',
  primaryCtaHref: '/shop',
  secondaryCtaLabel: 'For Business',
  secondaryCtaHref: '/wholesale',
  scrollHintLabel: 'Scroll',
};

export async function getHomepageHero(): Promise<HomepageHero> {
  const query = groq`
    *[_type == "homepageHero"][0] {
      eyebrow,
      headline,
      subhead,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
      scrollHintLabel,
    }
  `;
  const data = await safeFetch<HomepageHero | null>(query, {}, null);
  return data ?? HERO_DEFAULTS;
}

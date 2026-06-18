// Plain data module (NOT 'use client') for the homepage featured collections.
//
// This must NOT live in the 'use client' FeaturedCollections component: when a
// Server Component (app/(site)/page.tsx) imports a value from a 'use client'
// module, Next hands it a client-reference proxy (a function), not the real
// value — so FEATURED_COLLECTION_SLUGS would arrive as a function and the GROQ
// `slug.current in $slugs` would match nothing. Keeping it in a neutral module
// lets both the server page and the client component import the real array.

export interface FeaturedCollection {
  /** Real Sanity collection slug — drives both the image lookup and the /shop?collection= link. */
  slug: string;
  title: string;
  description: string;
}

export const featuredCollections: FeaturedCollection[] = [
  {
    slug: 'the-eternal-edit',
    title: 'The Eternal Edit',
    description: 'Our most sought-after arrangements. Timeless forms, enduring beauty.',
  },
  {
    slug: 'maison-collection',
    title: 'Maison Collection',
    description: 'Architectural vessels. Roses selected for their quietude.',
  },
  {
    slug: 'david',
    title: 'The Signature Series',
    description: 'Our signature hand-formed ceramics. One-of-a-kind, never repeated.',
  },
];

/** Collection slugs whose product images feed the homepage carousels. */
export const FEATURED_COLLECTION_SLUGS = featuredCollections.map((c) => c.slug);

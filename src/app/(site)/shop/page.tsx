import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllProducts, getAllCollections } from '@/sanity/queries';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterBar } from '@/components/shop/FilterBar';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop' };

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { collection, minPrice, maxPrice } = await searchParams;

  const [products, collections] = await Promise.all([
    getAllProducts({
      collection,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    getAllCollections(),
  ]);

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-6 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <p className="label-caps text-warm-gray mb-2">Shop</p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal">
          The Collection
        </h1>
      </div>

      {/* Filter bar — uses useSearchParams, must be wrapped in Suspense */}
      <Suspense fallback={<div className="border-y border-charcoal/10 h-[53px]" />}>
        <FilterBar
          collections={collections}
          activeCollection={collection}
          minPrice={minPrice}
          maxPrice={maxPrice}
          totalCount={products.length}
        />
      </Suspense>

      {/* Products grid */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-3xl font-light text-charcoal mb-3">
              {collection ? 'No products in this collection yet.' : 'No products yet.'}
            </p>
            <p className="font-body text-sm text-warm-gray max-w-sm leading-relaxed">
              Products are managed in the{' '}
              <a href="/studio" className="underline hover:text-charcoal transition-colors">
                Sanity Studio
              </a>
              . Add your first product to see it appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

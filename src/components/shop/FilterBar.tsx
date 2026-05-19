'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Collection } from '@/sanity/types';

interface FilterBarProps {
  collections: Collection[];
  activeCollection?: string;
  minPrice?: string;
  maxPrice?: string;
  totalCount: number;
}

export function FilterBar({
  collections,
  activeCollection,
  totalCount,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearAll = () => router.push(pathname);
  const hasFilters = !!activeCollection;

  return (
    <div className="border-y border-charcoal/10 py-4">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 flex flex-wrap items-center gap-3">

        {/* Collection pills */}
        <button
          onClick={() => setParam('collection', null)}
          className={cn(
            'label-caps px-4 py-2 border transition-colors duration-200',
            !activeCollection
              ? 'border-charcoal bg-charcoal text-ivory'
              : 'border-charcoal/20 text-warm-gray hover:border-charcoal hover:text-charcoal',
          )}
        >
          All
        </button>
        {collections.map((col) => (
          <button
            key={col._id}
            onClick={() =>
              setParam(
                'collection',
                activeCollection === col.slug.current ? null : col.slug.current,
              )
            }
            className={cn(
              'label-caps px-4 py-2 border transition-colors duration-200',
              activeCollection === col.slug.current
                ? 'border-charcoal bg-charcoal text-ivory'
                : 'border-charcoal/20 text-warm-gray hover:border-charcoal hover:text-charcoal',
            )}
          >
            {col.title}
          </button>
        ))}

        {/* Active filter count + clear */}
        <div className="ml-auto flex items-center gap-4">
          <span className="label-caps text-warm-gray">
            {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
          </span>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 label-caps text-warm-gray hover:text-charcoal transition-colors duration-200"
            >
              <X size={11} strokeWidth={1.5} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

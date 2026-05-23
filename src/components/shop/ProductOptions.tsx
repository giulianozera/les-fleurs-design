'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/sanity/types';
import { useCartStore } from '@/store/cartStore';
import type { ShippingRate } from '@/lib/shipping';

interface ProductOptionsProps {
  product: Product;
  initialColorSlug?: string;
}

export function ProductOptions({ product, initialColorSlug }: ProductOptionsProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(() => {
    if (initialColorSlug) {
      const match = product.roseColors.find(
        (c) => c.slug.current === initialColorSlug && c.available,
      );
      if (match) return match._id;
    }
    return product.roseColors.find((c) => c.available)?._id ?? null;
  });
  const [selectedPotId, setSelectedPotId] = useState<string | null>(
    product.potOptions?.find((p) => p.available)?._id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [zip, setZip] = useState('');
  const [zipRates, setZipRates] = useState<ShippingRate[] | null>(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialColorSlug) {
      const match = product.roseColors.find(
        (c) => c.slug.current === initialColorSlug && c.available,
      );
      if (match) setSelectedColorId(match._id);
    }
  }, [initialColorSlug]);

  async function handleEstimateShipping() {
    setZipError(null);
    setZipRates(null);
    setZipLoading(true);
    try {
      const res = await fetch('/api/shipping/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip,
          weightGrams: product.weightGrams ?? 500,
          orderSubtotal: product.basePrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not estimate shipping.');
      setZipRates(data.rates);
    } catch (e) {
      setZipError(e instanceof Error ? e.message : 'Could not estimate shipping.');
    } finally {
      setZipLoading(false);
    }
  }

  const inStock = product.stockQuantity > 0;

  const selectedColor = product.roseColors.find((c) => c._id === selectedColorId);
  const selectedPot = product.potOptions.find((p) => p._id === selectedPotId);

  function handleAddToCart() {
    addItem({
      productId: product._id,
      productSlug: product.slug.current,
      title: product.title,
      price: product.basePrice,
      quantity,
      imageUrl: product.images?.[0]?.url ?? '',
      colorId: selectedColor?._id,
      colorName: selectedColor?.name,
      colorHex: selectedColor?.hexValue,
      potId: selectedPot?._id,
      potName: selectedPot?.name,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  return (
    <div className="flex flex-col gap-7 pt-[72px] lg:pt-12">
      {/* Breadcrumb */}
      {product.collection && (
        <p className="label-caps text-warm-gray">{product.collection.title}</p>
      )}

      {/* Title + Price */}
      <div>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal leading-tight">
          {product.title}
        </h1>
        <p className="font-display text-2xl font-light text-charcoal mt-2">
          ${product.basePrice.toLocaleString()}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="font-body text-sm text-warm-gray leading-[1.8]">
          {product.description}
        </p>
      )}

      <div className="w-full h-px bg-charcoal/10" />

      {/* Rose color selector */}
      {product.colorVariants.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps text-charcoal">Rose Color</p>
            <p className="font-body text-sm text-warm-gray">
              {product.colorVariants.find((v) => v.productSlug === product.slug.current)?.colorName ?? product.roseColors[0]?.name ?? 'Select'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colorVariants.map((v) => {
              const isCurrent = v.productSlug === product.slug.current;
              return (
                <Link
                  key={v.colorId}
                  href={`/shop/${v.productSlug}`}
                  title={v.colorName}
                  aria-label={v.colorName}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all duration-200',
                    isCurrent ? 'border-charcoal scale-110' : 'border-transparent hover:border-charcoal/40',
                  )}
                  style={{ backgroundColor: v.colorHex }}
                />
              );
            })}
          </div>
        </div>
      ) : product.roseColors.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps text-charcoal">Rose Color</p>
            <p className="font-body text-sm text-warm-gray">
              {product.roseColors.find((c) => c._id === selectedColorId)?.name ?? 'Select'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.roseColors.map((color) => (
              <button
                key={color._id}
                onClick={() => {
                  if (!color.available) return;
                  setSelectedColorId(color._id);
                  router.replace(`${pathname}?color=${color.slug.current}`, { scroll: false });
                }}
                disabled={!color.available}
                title={color.name}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all duration-200',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  selectedColorId === color._id
                    ? 'border-charcoal scale-110'
                    : 'border-transparent hover:border-charcoal/40',
                )}
                style={{ backgroundColor: color.hexValue }}
                aria-label={color.name}
                aria-pressed={selectedColorId === color._id}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Pot option selector */}
      {product.potOptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps text-charcoal">Ceramic Vessel</p>
            <p className="font-body text-sm text-warm-gray">
              {product.potOptions.find((p) => p._id === selectedPotId)?.name ?? 'Select'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.potOptions.map((pot) => (
              <button
                key={pot._id}
                onClick={() => pot.available && setSelectedPotId(pot._id)}
                disabled={!pot.available}
                className={cn(
                  'px-4 py-2 border label-caps text-xs transition-all duration-200',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  selectedPotId === pot._id
                    ? 'border-charcoal bg-charcoal text-ivory'
                    : 'border-charcoal/20 text-warm-gray hover:border-charcoal hover:text-charcoal',
                )}
                aria-pressed={selectedPotId === pot._id}
              >
                {pot.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full h-px bg-charcoal/10" />

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-4">
        {/* Quantity stepper */}
        <div className="flex items-center border border-charcoal/20">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-ivory-dark transition-colors duration-200"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center font-body text-sm text-charcoal">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
            className="w-11 h-11 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-ivory-dark transition-colors duration-200"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          disabled={!inStock}
          className={cn(
            'flex-1 h-11 label-caps transition-colors duration-300',
            inStock
              ? addedFeedback
                ? 'bg-stone text-ivory'
                : 'bg-charcoal text-ivory hover:bg-stone'
              : 'bg-charcoal/20 text-warm-gray cursor-not-allowed',
          )}
          onClick={handleAddToCart}
        >
          {!inStock ? 'Out of Stock' : addedFeedback ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>

      {/* Shipping estimator */}
      <div className="border border-charcoal/10 p-4">
        <p className="label-caps text-warm-gray mb-3">Estimate Shipping</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
              setZipRates(null);
              setZipError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && zip.length === 5 && handleEstimateShipping()}
            placeholder="Enter ZIP code"
            maxLength={5}
            inputMode="numeric"
            className="flex-1 bg-transparent border-b border-charcoal/20 py-1.5 font-body text-sm text-charcoal placeholder:text-warm-gray outline-none focus:border-charcoal transition-colors duration-200"
            aria-label="ZIP code for shipping estimate"
          />
          <button
            onClick={handleEstimateShipping}
            disabled={zip.length !== 5 || zipLoading}
            className="label-caps text-charcoal/50 hover:text-charcoal transition-colors duration-200 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {zipLoading ? '…' : 'Check'}
          </button>
        </div>

        {zipError && (
          <p className="font-body text-xs text-red-500 mt-2">{zipError}</p>
        )}

        {zipRates && zipRates.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {zipRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between">
                <div>
                  <span className="font-body text-xs text-charcoal">{rate.displayName}</span>
                  <span className="font-body text-xs text-warm-gray ml-2">{rate.deliveryDays}</span>
                </div>
                <span className="font-body text-xs text-charcoal">
                  {rate.price === 0 ? 'Free' : `$${rate.price}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

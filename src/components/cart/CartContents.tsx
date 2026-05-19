'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCartStore, useCartSubtotal } from '@/store/cartStore';

export function CartContents() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = useCartSubtotal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const FREE_SHIPPING_THRESHOLD = 200;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Checkout failed. Please try again.');
      }
      const { url } = await res.json();
      clearCart();
      router.push(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-24">
        <p className="font-display text-3xl font-light text-charcoal mb-4">
          Your cart is empty.
        </p>
        <p className="font-body text-sm text-warm-gray mb-10">
          Discover our collection of preserved roses in handcrafted ceramic vessels.
        </p>
        <Link
          href="/shop"
          className="label-caps border border-charcoal text-charcoal px-8 py-3 hover:bg-charcoal hover:text-ivory transition-colors duration-300"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px] px-6 md:px-10 lg:px-16 mx-auto max-w-[1400px] pb-24">
      <div className="py-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal">
          Your Cart
        </h1>
        <p className="font-body text-sm text-warm-gray mt-1">
          {items.reduce((n, i) => n + i.quantity, 0)} item
          {items.reduce((n, i) => n + i.quantity, 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-16 lg:items-start">
        {/* Line items */}
        <div className="flex flex-col divide-y divide-charcoal/10">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 py-7">
              {/* Product image */}
              <Link href={`/shop/${item.productSlug}`} className="flex-shrink-0">
                <div className="relative w-20 aspect-[4/5] bg-ivory-dark overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full bg-ivory-dark" />
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/shop/${item.productSlug}`}
                      className="font-body text-sm font-medium text-charcoal hover:text-stone transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                    <div className="flex flex-col gap-0.5 mt-1">
                      {item.colorName && (
                        <span className="font-body text-xs text-warm-gray">
                          Rose Color: {item.colorName}
                        </span>
                      )}
                      {item.potName && (
                        <span className="font-body text-xs text-warm-gray">
                          Ceramic Vessel: {item.potName}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-charcoal/30 hover:text-charcoal transition-colors duration-200 flex-shrink-0"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity stepper */}
                  <div className="flex items-center border border-charcoal/20 w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-charcoal/50 hover:text-charcoal hover:bg-ivory-dark transition-colors duration-200 text-sm"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-body text-sm text-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-charcoal/50 hover:text-charcoal hover:bg-ivory-dark transition-colors duration-200 text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-body text-sm text-charcoal">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0 border border-charcoal/10 p-8 lg:sticky lg:top-[96px]">
          <h2 className="label-caps text-charcoal mb-6">Order Summary</h2>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between font-body text-sm text-charcoal">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-warm-gray">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          {toFreeShipping > 0 && (
            <p className="font-body text-xs text-warm-gray mb-6 border-t border-charcoal/10 pt-4">
              Add ${toFreeShipping.toFixed(0)} more for free shipping
            </p>
          )}
          {toFreeShipping <= 0 && (
            <p className="font-body text-xs text-gold mb-6 border-t border-charcoal/10 pt-4">
              You qualify for free shipping
            </p>
          )}

          <div className="flex justify-between font-body text-sm font-medium text-charcoal border-t border-charcoal/10 pt-4 mb-8">
            <span>Total</span>
            <span>${subtotal.toLocaleString()}+</span>
          </div>

          {error && (
            <p className="font-body text-xs text-red-600 mb-4">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-12 bg-charcoal text-ivory label-caps hover:bg-stone transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting…' : 'Proceed to Checkout'}
          </button>

          <p className="font-body text-xs text-warm-gray text-center mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

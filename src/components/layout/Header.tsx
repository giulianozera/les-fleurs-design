'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartCount } from '@/store/cartStore';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/business', label: 'Business' },
  { href: '/interiors', label: 'Interiors' },
  { href: '/about', label: 'Story' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartCount();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-ivory/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(26,26,26,0.08)]'
          : 'bg-ivory/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-10" aria-label="Les Fleurs Design — Home">
            <Image
              src="/logo.png"
              alt="Les Fleurs Design"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="label-caps text-charcoal/70 hover:text-charcoal transition-colors duration-300 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1 text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
                {mounted && cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-ivory"
                  style={{ fontSize: '9px', fontFamily: 'var(--font-inter)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1 text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-[72px] bg-ivory flex flex-col px-6 pt-12 pb-10 transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col gap-8" aria-label="Mobile navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-light text-charcoal hover:text-stone transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <p className="label-caps text-charcoal/40">Quiet luxury, in full bloom.</p>
        </div>
      </div>
    </header>
  );
}

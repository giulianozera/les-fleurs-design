import Link from 'next/link';
import Image from 'next/image';
import { FooterNewsletter } from './FooterNewsletter';

const shopLinks = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop?collection=eternal-edit', label: 'The Eternal Edit' },
  { href: '/shop?collection=maison', label: 'Maison Collection' },
  { href: '/shop?collection=signature', label: 'The Signature Series' },
];

const companyLinks = [
  { href: '/about', label: 'Our Story' },
  { href: '/wholesale', label: 'Wholesale & B2B' },
  { href: '/contact', label: 'Contact' },
];

const infoLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping & Returns' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/70">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Les Fleurs Design — Home">
              <Image
                src="/logo.png"
                alt="Les Fleurs Design"
                width={140}
                height={42}
                className="h-9 w-auto object-contain brightness-0 invert opacity-80 mb-6"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-ivory/50 max-w-[200px]">
              Roses preserved at peak bloom. One year. For gifts, lobbies, and the spaces that demand distinction.
            </p>
            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-ivory/40 hover:text-ivory transition-colors duration-300"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-ivory/40 hover:text-ivory transition-colors duration-300"
                aria-label="Pinterest"
              >
                PIN
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="label-caps text-ivory/30 mb-5">Shop</p>
            <ul className="flex flex-col gap-3">
              {shopLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="label-caps text-ivory/30 mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info + newsletter teaser */}
          <div>
            <p className="label-caps text-ivory/30 mb-5">Information</p>
            <ul className="flex flex-col gap-3 mb-8">
              {infoLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ivory/10 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-ivory/30">
            © {new Date().getFullYear()} Les Fleurs Design. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
              <span key={method} className="label-caps text-[9px] text-ivory/25 border border-ivory/10 px-1.5 py-0.5 rounded-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

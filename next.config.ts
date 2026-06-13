import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

// ── Content Security Policy ───────────────────────────────────────────────────
//
// No-nonce (static) CSP per the Next.js guide, so pages stay statically
// optimized / CDN-cached and nothing in the UI breaks. Inline scripts/styles
// that Next and framer-motion emit are allowed via 'unsafe-inline'; a future
// hardening step could move to a nonce-based policy via proxy.ts (Next 16's
// middleware) at the cost of dynamic rendering.
//
// Third parties the storefront legitimately talks to:
//   • Stripe.js / Checkout redirect  → js.stripe.com, api.stripe.com
//   • Cloudflare Turnstile           → challenges.cloudflare.com
//   • Sanity (content + image CDN)   → *.sanity.io, cdn.sanity.io
//   • Cal.com booking embed (iframe) → cal.com
function storefrontCsp(): string {
  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'self'`,
    `form-action 'self'`,
    // 'unsafe-eval' only in dev (React uses eval for better stack traces).
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://js.stripe.com https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://cdn.sanity.io https://placehold.co`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.api.sanity.io https://api.stripe.com https://challenges.cloudflare.com`,
    `frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://cal.com https://*.cal.com`,
    `worker-src 'self' blob:`,
    `media-src 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

// The embedded Sanity Studio (/studio) is a heavy SPA that needs eval, blob
// workers, websockets and a range of Sanity/Google origins. It runs on our
// origin and is auth-gated by Sanity, so we relax CSP there (this entry comes
// after the global one and wins by last-match-override) while still blocking
// cross-origin framing.
function studioCsp(): string {
  return [
    `default-src 'self' https: data: blob:`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:`,
    `style-src 'self' 'unsafe-inline' https:`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data: https:`,
    `connect-src 'self' https: wss: blob:`,
    `worker-src 'self' blob:`,
    `frame-src 'self' https:`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
  ].join('; ');
}

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // HSTS: HTTPS-only for 2 years incl. subdomains. (No `preload` — that's an
  // irreversible commitment; add it once you're sure every subdomain is HTTPS.)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        // Sanity CDN — added in Phase 2
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      // Global: hardening headers + storefront CSP on every route.
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: storefrontCsp() },
        ],
      },
      // Override: relaxed CSP for the embedded Sanity Studio (last match wins).
      {
        source: '/studio/:path*',
        headers: [{ key: 'Content-Security-Policy', value: studioCsp() }],
      },
    ];
  },
  async redirects() {
    return [
      // The commercial section was consolidated from /business into /interiors.
      { source: '/business', destination: '/interiors', permanent: true },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  async redirects() {
    return [
      // The commercial section was consolidated from /business into /interiors.
      { source: '/business', destination: '/interiors', permanent: true },
    ];
  },
};

export default nextConfig;

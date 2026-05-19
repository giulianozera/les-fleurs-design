'use client';

import dynamic from 'next/dynamic';

// Both next-sanity/studio and the Sanity config use browser-only APIs.
// We load them client-side only to prevent SSR errors.
const StudioWithConfig = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import('next-sanity/studio'),
      import('@/sanity/sanity.config'),
    ]);
    const Studio = () => <NextStudio config={config} />;
    Studio.displayName = 'Studio';
    return Studio;
  },
  { ssr: false },
);

export default function StudioClientWrapper() {
  return <StudioWithConfig />;
}

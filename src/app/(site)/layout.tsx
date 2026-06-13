import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoseCursor } from '@/components/effects/RoseCursor';
import { PetalRain } from '@/components/effects/PetalRain';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-cursor-none flex min-h-screen flex-col">
      {/* Skip link — first focusable element. Visually off-screen until focused,
          then pinned to the top-left and fully visible. cursor-auto restores the
          native pointer (the layout otherwise forces cursor:none site-wide). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-sm focus:bg-charcoal focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:text-ivory focus:no-underline focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory/70 [cursor:auto!important]"
      >
        Skip to content
      </a>
      <RoseCursor />
      <PetalRain />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

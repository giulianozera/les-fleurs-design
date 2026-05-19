import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoseCursor } from '@/components/effects/RoseCursor';
import { PetalRain } from '@/components/effects/PetalRain';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-cursor-none flex min-h-screen flex-col">
      <RoseCursor />
      <PetalRain />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

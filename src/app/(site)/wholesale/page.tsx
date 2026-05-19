import type { Metadata } from 'next';
import { WholesaleContent } from '@/components/wholesale/WholesaleContent';

export const metadata: Metadata = {
  title: 'Wholesale & B2B — Les Fleurs Design',
  description: 'Partner programs for hotels, retailers, florists, and interior designers.',
};

export default function WholesalePage() {
  return <WholesaleContent />;
}

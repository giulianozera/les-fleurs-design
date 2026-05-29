import type { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'Our Story — Les Fleurs Design',
  description:
    'The story behind Les Fleurs Design — a Miami atelier founded on a refusal to accept that beauty must be temporary.',
};

export default function AboutPage() {
  return <AboutContent />;
}

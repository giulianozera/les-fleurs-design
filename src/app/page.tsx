import { HeroLesFleurs } from '@/components/home/HeroLesFleurs';
import { BeyondTheGift } from '@/components/home/BeyondTheGift';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { WhySection } from '@/components/home/WhySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Testimonials } from '@/components/home/Testimonials';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroLesFleurs />
      <BeyondTheGift />
      <FeaturedCollections />
      <WhySection />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}

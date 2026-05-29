import { HeroLesFleurs } from '@/components/home/HeroLesFleurs';
import { OurStory } from '@/components/home/OurStory';
import { BeyondTheGift } from '@/components/home/BeyondTheGift';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { WhySection } from '@/components/home/WhySection';
import { StoryPreview } from '@/components/home/StoryPreview';
import { Newsletter } from '@/components/home/Newsletter';
import { getHomepageHero, getMaisonImages } from '@/sanity/queries';

export default async function HomePage() {
  const [hero, maisonImages] = await Promise.all([
    getHomepageHero(),
    getMaisonImages(),
  ]);
  return (
    <>
      <HeroLesFleurs {...hero} />
      <OurStory />
      <BeyondTheGift maisonImages={maisonImages} />
      <FeaturedCollections />
      <WhySection />
      <StoryPreview />
      <Newsletter />
    </>
  );
}

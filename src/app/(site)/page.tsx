import { HeroLesFleurs } from '@/components/home/HeroLesFleurs';
import { BeyondTheGift } from '@/components/home/BeyondTheGift';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { FEATURED_COLLECTION_SLUGS } from '@/components/home/featuredCollections.data';
import { WhySection } from '@/components/home/WhySection';
import { StoryPreview } from '@/components/home/StoryPreview';
import { Newsletter } from '@/components/home/Newsletter';
import { getHomepageHero, getMaisonImages, getFeaturedCollectionImages } from '@/sanity/queries';

export default async function HomePage() {
  const [hero, maisonImages, collectionImages] = await Promise.all([
    getHomepageHero(),
    getMaisonImages(),
    getFeaturedCollectionImages(FEATURED_COLLECTION_SLUGS),
  ]);
  return (
    <>
      <HeroLesFleurs {...hero} />
      <BeyondTheGift maisonImages={maisonImages} />
      <FeaturedCollections collectionImages={collectionImages} />
      <WhySection />
      <StoryPreview />
      <Newsletter />
    </>
  );
}

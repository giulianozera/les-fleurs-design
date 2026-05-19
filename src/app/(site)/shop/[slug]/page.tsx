import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/sanity/queries';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductOptions } from '@/components/shop/ProductOptions';
import { CareAccordion } from '@/components/shop/CareAccordion';
import { ProductCard } from '@/components/shop/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.title,
    description: product.description ?? `${product.title} — Les Fleurs Design`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = product.collection
    ? await getRelatedProducts(product.collection._id, product._id)
    : [];

  return (
    <>
      {/* Product detail layout */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-16">
          {/* Left: Image gallery */}
          <div className="lg:sticky lg:top-[72px] lg:self-start lg:pt-8">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right: Product info + options */}
          <ProductOptions product={product} />
        </div>
      </div>

      {/* Care + shipping accordion — below the grid on mobile, right column only on desktop */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 pb-16">
        <div className="lg:ml-[55%] lg:pl-16">
          <CareAccordion instructions={product.careInstructions ?? []} />
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-ivory-dark py-16 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
            <p className="label-caps text-warm-gray mb-8">You May Also Like</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

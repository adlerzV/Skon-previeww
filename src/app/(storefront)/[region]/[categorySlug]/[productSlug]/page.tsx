import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/graphql";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductContentMatrix from "@/components/product/ProductContentMatrix";
import ProductDescriptionSections from "@/components/product/ProductDescriptionSections";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import WishlistButtonAsync, { WishlistButtonSkeleton } from "@/components/product/WishlistButtonAsync";

interface ProductPageProps {
  params: Promise<{ region: string; categorySlug: string; productSlug: string }>;
  searchParams: Promise<{ edition?: string }>;
}

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { region, productSlug } = await params;
  const { edition } = await searchParams;

  const product = await getProductDetail(productSlug, region);

  if (!product) notFound();

  const { secondaryGallery, description, reviewCount, averageRating, contentMatrix } = product;

  return (
    <main className="container mx-auto px-6 max-w-site py-8">
      <ProductPageClient
        product={{
          ...product,
          secondaryGallery: undefined,
          description: undefined,
          reviewCount: undefined,
          averageRating: undefined,
          contentMatrix: undefined,
        }}
        initialEdition={edition}
        activeRegion={region}
        wishlistSlot={
          <Suspense fallback={<WishlistButtonSkeleton size={22} />}>
            <WishlistButtonAsync productId={product.databaseId} size={22} />
          </Suspense>
        }
      >
        <ProductContentMatrix contentMatrix={contentMatrix} />
        <ProductDescriptionSections secondaryGallery={secondaryGallery} description={description} />
        <ProductReviewsSection
          productId={product.databaseId}
          averageRating={averageRating ?? 0}
          reviewCount={reviewCount}
        />
      </ProductPageClient>
    </main>
  );
}
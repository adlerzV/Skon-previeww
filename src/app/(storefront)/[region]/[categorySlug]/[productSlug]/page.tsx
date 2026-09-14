import { notFound } from "next/navigation";
import { getProductDetail, getWishlistProductIds } from "@/lib/graphql";
import { getCurrentUser, getAuthToken } from "@/lib/auth/session";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductDescriptionSections from "@/components/product/ProductDescriptionSections";
import ProductReviewsSection from "@/components/ProductReviewsSection";

interface ProductPageProps {
  params: Promise<{ region: string; categorySlug: string; productSlug: string }>;
  searchParams: Promise<{ edition?: string }>;
}

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { region, productSlug } = await params;
  const { edition } = await searchParams;

  const [product, user, token] = await Promise.all([
    getProductDetail(productSlug, region),
    getCurrentUser().catch(() => null),
    getAuthToken().catch(() => null),
  ]);

  if (!product) notFound();

  const wishlistIds = token ? await getWishlistProductIds(token).catch(() => []) : [];
  const isLoggedIn = Boolean(user);
  const isStaff = Boolean(user?.isStaff);
  const initialInWishlist = wishlistIds.includes(product.databaseId);

  const { secondaryGallery, description, reviewCount, averageRating } = product;

  return (
    <main className="container mx-auto px-6 max-w-site py-8">
      <ProductPageClient
        product={{
          ...product,
          secondaryGallery: undefined,
          description: undefined,
          reviewCount: undefined,
          averageRating: undefined,
        }}
        initialEdition={edition}
        activeRegion={region}
        isLoggedIn={isLoggedIn}
        initialInWishlist={initialInWishlist}
      >
        <ProductDescriptionSections secondaryGallery={secondaryGallery} description={description} />
        <ProductReviewsSection
          productId={product.databaseId}
          averageRating={averageRating ?? 0}
          reviewCount={reviewCount}
          isLoggedIn={isLoggedIn}
          isStaff={isStaff}
        />
      </ProductPageClient>
    </main>
  );
}
import { Suspense } from "react";
import { getProductReviews } from "@/lib/graphql/reviews";
import ProductReviews from "./ProductReviews";
import Skeleton from "@/components/ui/Skeleton";

interface ProductReviewsSectionProps {
  productId: number;
  averageRating: number;
  reviewCount?: number;
  isLoggedIn: boolean;
  isStaff?: boolean;
}

async function ProductReviewsData({
  productId,
  averageRating,
  reviewCount,
  isLoggedIn,
  isStaff,
}: ProductReviewsSectionProps) {
  const { reviews, pageInfo } = await getProductReviews(productId);

  return (
    <ProductReviews
      productId={productId}
      reviews={reviews}
      pageInfo={pageInfo}
      averageRating={averageRating}
      reviewCount={reviewCount}
      isLoggedIn={isLoggedIn}
      isStaff={isStaff}
    />
  );
}

function ProductReviewsSkeleton() {
  return (
    <div className="w-full border-t border-brand-surface_hover pt-8 flex flex-col gap-6" dir="rtl">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="lg:col-span-4 h-48 w-full" />
      </div>
    </div>
  );
}

export default function ProductReviewsSection(props: ProductReviewsSectionProps) {
  return (
    <Suspense fallback={<ProductReviewsSkeleton />}>
      <ProductReviewsData {...props} />
    </Suspense>
  );
}
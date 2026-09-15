import { getCurrentUser, getAuthToken } from "@/lib/auth/session";
import { getWishlistProductIds } from "@/lib/graphql";
import WishlistButton from "./WishlistButton";

export function WishlistButtonSkeleton({ size = 22 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full bg-white/5 animate-pulse shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export default async function WishlistButtonAsync({
  productId,
  size = 22,
}: {
  productId: number;
  size?: number;
}) {
  const token = await getAuthToken().catch(() => null);

  const [user, wishlistIds] = await Promise.all([
    getCurrentUser().catch(() => null),
    token
      ? getWishlistProductIds(token).catch((): number[] => [])
      : Promise.resolve<number[]>([]),
  ]);

  return (
    <WishlistButton
      productId={productId}
      size={size}
      isLoggedIn={Boolean(user)}
      initialInWishlist={wishlistIds.includes(productId)}
    />
  );
}
import { getWishlistProductIds } from "@/lib/graphql";
import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import WishlistButton from "./WishlistButton";

export default async function WishlistButtonAsync({ productId }: { productId: number }) {
  const userPromise = getCurrentUser().catch(() => null);
  const token = await getAuthToken();
  const wishlistPromise = token
    ? getWishlistProductIds(token).catch(() => [])
    : Promise.resolve<number[]>([]);

  const [user, wishlistIds] = await Promise.all([userPromise, wishlistPromise]);

  return (
    <WishlistButton
      productId={productId}
      size={22}
      isLoggedIn={Boolean(user)}
      initialInWishlist={wishlistIds.includes(productId)}
    />
  );
}
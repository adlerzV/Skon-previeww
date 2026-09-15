import { getWishlistProductIds } from "@/lib/graphql";
import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import WishlistButton from "./WishlistButton";

export default async function WishlistButtonAsync({ productId }: { productId: number }) {
  const [user, token] = await Promise.all([
    getCurrentUser().catch(() => null),
    getAuthToken(),
  ]);

  const wishlistIds = token ? await getWishlistProductIds(token).catch(() => []) : [];

  return (
    <WishlistButton
      productId={productId}
      size={22}
      isLoggedIn={Boolean(user)}
      initialInWishlist={wishlistIds.includes(productId)}
    />
  );
}
import { getCurrentUser, getAuthToken } from "@/lib/auth/session";
import { getWishlistProductIds } from "@/lib/graphql";
import UserActions from "./UserActions";

export default async function UserActionsAsync() {
  const [user, wishlistIds] = await Promise.all([
    getCurrentUser().catch(() => null),
    getAuthToken()
      .then((token) => (token ? getWishlistProductIds(token) : []))
      .catch(() => []),
  ]);

  return (
    <UserActions
      user={user ? { name: user.name, avatarUrl: user.avatarUrl, isStaff: user.isStaff } : null}
      wishlistCount={wishlistIds.length}
    />
  );
}
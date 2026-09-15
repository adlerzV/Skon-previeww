import { getHeaderViewerData } from "@/lib/auth/session";
import UserActions from "./UserActions";

export default async function UserActionsAsync() {
  const { user, wishlistIds } = await getHeaderViewerData().catch(() => ({ user: null, wishlistIds: [] }));

  return <UserActions user={user} wishlistCount={wishlistIds.length} />;
}
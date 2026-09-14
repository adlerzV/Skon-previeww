import { getCurrentUser } from "@/lib/auth/session";
import MobileBottomNav from "./MobileBottomNav";

export default async function MobileBottomNavAsync() {
  const user = await getCurrentUser().catch(() => null);
  return <MobileBottomNav user={user ? { name: user.name, avatarUrl: user.avatarUrl } : null} />;
}
import { getHeaderCategories, getHeaderBlogCategories, getRegions } from "@/lib/graphql";
import { getCurrentUser } from "@/lib/auth/session";
import MobileMenu, { type MobileMenuDrawerData } from "./MobileMenu";

export default function MobileMenuAsync({ activeRegion }: { activeRegion: string }) {

  const regionsPromise = getRegions().catch(() => []);

  const drawerDataPromise: Promise<MobileMenuDrawerData> = Promise.all([
    getHeaderCategories(),
    getHeaderBlogCategories(),
    getCurrentUser().catch(() => null),
  ]).then(([shopItems, blogItems, user]) => ({
    shopItems,
    blogItems,
    user: user ? { name: user.name, avatarUrl: user.avatarUrl } : null,
  }));

  return (
    <MobileMenu
      activeRegion={activeRegion}
      regionsPromise={regionsPromise}
      drawerDataPromise={drawerDataPromise}
    />
  );
}
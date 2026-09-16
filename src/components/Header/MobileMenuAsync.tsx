import { getHeaderCategories, getHeaderBlogCategories, getRegions } from "@/lib/graphql";
import { getHeaderViewerData } from "@/lib/auth/session";
import MobileMenu, { type MobileMenuDrawerData } from "./MobileMenu";

export default function MobileMenuAsync({ activeRegion }: { activeRegion: string }) {
  const regionsPromise = getRegions().catch(() => []);

  const drawerDataPromise: Promise<MobileMenuDrawerData> = Promise.all([
    getHeaderCategories(),
    getHeaderBlogCategories(),
    getHeaderViewerData().catch(() => ({ user: null })),
  ]).then(([shopItems, blogItems, viewer]) => ({
    shopItems,
    blogItems,
    user: viewer.user ? { name: viewer.user.name, avatarUrl: viewer.user.avatarUrl } : null,
  }));

  return (
    <MobileMenu
      activeRegion={activeRegion}
      regionsPromise={regionsPromise}
      drawerDataPromise={drawerDataPromise}
    />
  );
}
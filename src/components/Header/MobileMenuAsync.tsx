import { getHeaderBlogCategories, getHeaderCategories, getRegions } from "@/lib/graphql";
import MobileMenu from "./MobileMenu";

export default function MobileMenuAsync({ activeRegion }: { activeRegion: string }) {
  // Start these cached server requests immediately, but do not await them here.
  // MobileMenu consumes them with React use() only when the relevant UI opens.
  const regionsPromise = getRegions().catch(() => []);
  const drawerDataPromise = Promise.all([
    getHeaderCategories().catch(() => []),
    getHeaderBlogCategories().catch(() => []),
  ]).then(([shopItems, blogItems]) => ({
    shopItems,
    blogItems,
    user: null,
  }));

  return (
    <MobileMenu
      activeRegion={activeRegion}
      regionsPromise={regionsPromise}
      drawerDataPromise={drawerDataPromise}
    />
  );
}

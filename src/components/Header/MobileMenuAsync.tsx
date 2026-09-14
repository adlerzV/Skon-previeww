import { getHeaderCategories, getHeaderBlogCategories, getRegions } from "@/lib/graphql";
import { getCurrentUser } from "@/lib/auth/session";
import MobileMenu from "./MobileMenu";

export default async function MobileMenuAsync({ activeRegion }: { activeRegion: string }) {
  const [shopGames, blogCats, regions, user] = await Promise.all([
    getHeaderCategories(),
    getHeaderBlogCategories(),
    getRegions().catch(() => []),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <MobileMenu
      shopItems={shopGames}
      blogItems={blogCats}
      user={user ? { name: user.name, avatarUrl: user.avatarUrl } : null}
      regions={regions}
      activeRegion={activeRegion}
    />
  );
}
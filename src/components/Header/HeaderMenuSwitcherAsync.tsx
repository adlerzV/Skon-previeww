import { getHeaderCategories, getHeaderBlogCategories } from "@/lib/graphql";
import HeaderMenuSwitcher from "./HeaderMenuSwitcher";

export default async function HeaderMenuSwitcherAsync() {
  const [shopGames, blogCats] = await Promise.all([
    getHeaderCategories(),
    getHeaderBlogCategories(),
  ]);

  return <HeaderMenuSwitcher shopItems={shopGames} blogItems={blogCats} />;
}
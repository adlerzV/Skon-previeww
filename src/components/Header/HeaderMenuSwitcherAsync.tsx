import { getHeaderPublicNavigationData } from "@/lib/graphql";
import HeaderMenuSwitcher from "./HeaderMenuSwitcher";

export default async function HeaderMenuSwitcherAsync() {
  const { shopItems, blogItems } = await getHeaderPublicNavigationData();
  return <HeaderMenuSwitcher shopItems={shopItems} blogItems={blogItems} />;
}

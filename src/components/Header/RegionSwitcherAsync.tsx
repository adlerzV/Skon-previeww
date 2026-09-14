import { getRegions } from "@/lib/graphql";
import RegionSwitcher from "./RegionSwitcher";

export default async function RegionSwitcherAsync({ initialRegion }: { initialRegion: string }) {
  const regions = await getRegions().catch(() => []);
  return <RegionSwitcher regions={regions} initialRegion={initialRegion} />;
}
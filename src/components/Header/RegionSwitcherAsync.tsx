import { getHeaderRegionsData } from "@/lib/graphql";
import RegionSwitcher from "./RegionSwitcher";

export default async function RegionSwitcherAsync({ initialRegion }: { initialRegion: string }) {
  const { regions } = await getHeaderRegionsData().catch(() => ({ regions: [] }));
  return <RegionSwitcher regions={regions} initialRegion={initialRegion} />;
}

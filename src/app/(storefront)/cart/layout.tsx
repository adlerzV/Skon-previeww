import { cookies } from "next/headers";
import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import SubHeaderBar from "@/components/Header/SubHeaderBar";
import Footer from "@/components/Footer/Footer";
import { DEFAULT_REGION, KNOWN_REGIONS } from "@/lib/regions";

export default async function CartLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const cookieRegion = cookieStore.get("store_region")?.value?.toLowerCase();
  const activeRegion = cookieRegion && KNOWN_REGIONS.includes(cookieRegion) ? cookieRegion : DEFAULT_REGION;

  return (
    <>
      <Header activeRegion={activeRegion} />
      <SubHeaderBar />
      {children}
      <Footer activeRegion={activeRegion} />
    </>
  );
}

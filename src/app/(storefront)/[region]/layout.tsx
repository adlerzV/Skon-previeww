import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import SubHeaderBar from "@/components/Header/SubHeaderBar";
import Footer from "@/components/Footer/Footer";
import { KNOWN_REGIONS } from "@/lib/regions";

export const revalidate = 900;
export const dynamicParams = false;

export function generateStaticParams() {
  return KNOWN_REGIONS.map((region) => ({ region }));
}

export default async function RegionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;

  return (
    <>
      <Header activeRegion={region} />
      <SubHeaderBar />
      {children}
      <Footer activeRegion={region} />
    </>
  );
}

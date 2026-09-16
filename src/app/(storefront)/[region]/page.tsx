import { Suspense } from "react";
import { getHomeHeroData } from "@/lib/graphql";
import CategoryHero from "@/components/Hero";
import HomeFeaturedGrid from "@/components/home/HomeFeaturedGrid";
import HomeLatestGrid from "@/components/home/HomeLatestGrid";
import { ProductGridSkeleton } from "@/components/home/HomeSkeletons";

interface HomeProps {
  params: Promise<{ region: string }>;
}

export default async function Home({ params }: HomeProps) {
  const [{ region }, { banners }] = await Promise.all([params, getHomeHeroData()]);

  return (
    <main className="container mx-auto px-6 max-w-site pb-12">
      <CategoryHero banners={banners} />

      <Suspense fallback={<ProductGridSkeleton />}>
        <HomeFeaturedGrid region={region} />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <HomeLatestGrid region={region} />
      </Suspense>
    </main>
  );
}
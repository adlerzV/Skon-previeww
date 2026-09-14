import Skeleton from "@/components/ui/Skeleton";
import { ProductGridSkeleton } from "@/components/home/HomeSkeletons";

export default function Loading() {
  return (
    <main className="container mx-auto px-6 max-w-site pb-12">
      <div className="relative w-full h-[240px] my-1 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </main>
  );
}
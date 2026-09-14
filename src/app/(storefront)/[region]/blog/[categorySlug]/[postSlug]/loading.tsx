import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-site">
      <Skeleton className="w-full h-[220px] sm:h-[300px] md:h-[420px] mb-6 md:mb-8" />
      <div className="mb-6 md:mb-8 flex flex-col gap-3">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="order-2 lg:order-1 lg:col-span-3">
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="order-3 lg:col-span-3">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </main>
  );
}
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-6 max-w-site py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 w-full">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Skeleton className="w-full aspect-[16/9]" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-[100px] aspect-video shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
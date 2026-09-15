import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-6 max-w-site py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 w-full items-start">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="w-6 h-6 rounded-full shrink-0" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            {Array.from({ length: 2 }).map((_, groupIdx) => (
              <div key={groupIdx} className="flex-1 flex flex-col gap-2.5 min-w-0">
                <Skeleton className="h-3 w-20" />
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[68px] w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[90px] w-full" />
              ))}
            </div>
            <Skeleton className="h-[72px] w-full mt-2" />
            <Skeleton className="h-[64px] w-full" />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 w-full">
            <Skeleton className="flex-1 aspect-[16/9] w-full" />
            <div className="w-full sm:w-[96px] lg:w-[108px] shrink-0 flex flex-row sm:flex-col gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[86px] sm:w-full aspect-video shrink-0" />
              ))}
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </main>
  );
}
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-site">
      <Skeleton className="h-8 w-64 mb-3" />
      <Skeleton className="h-4 w-40 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[220px] w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full" />
        ))}
      </div>
    </main>
  );
}
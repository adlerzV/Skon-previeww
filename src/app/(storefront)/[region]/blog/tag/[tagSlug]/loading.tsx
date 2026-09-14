import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-site">
      <div className="mb-8">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full" />
        ))}
      </div>
    </main>
  );
}
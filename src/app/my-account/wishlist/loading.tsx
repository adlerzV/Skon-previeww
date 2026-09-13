import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-7 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full" />
        ))}
      </div>
    </div>
  );
}
import Skeleton from "@/components/ui/Skeleton";

export default function BlogRatingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-9 w-14" />
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-5 h-5 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardContentSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <Skeleton className="lg:col-span-2 h-[110px]" />
        <Skeleton className="h-[110px]" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <Skeleton className="h-full min-h-[240px]" />
        <Skeleton className="h-full min-h-[240px]" />
      </div>
    </div>
  );
}
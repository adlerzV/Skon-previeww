import Skeleton from "@/components/ui/Skeleton";

function Block() {
  return (
    <div className="bg-brand-surface border border-brand-surface_hover p-4">
      <Skeleton className="h-3.5 w-24 mb-3" />
      <div className="flex flex-col gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5">
            <Skeleton className="w-8 h-8 shrink-0 rounded" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RelatedNewsPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Block />
      <Block />
    </div>
  );
}
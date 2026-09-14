import Skeleton from "@/components/ui/Skeleton";

export default function GamesNavSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="w-9 h-9 rounded-md shrink-0" />
      ))}
    </div>
  );
}
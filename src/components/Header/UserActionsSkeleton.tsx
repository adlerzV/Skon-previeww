import Skeleton from "@/components/ui/Skeleton";

export default function UserActionsSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-4">
      <Skeleton className="w-5 h-5 rounded-full" />
      <Skeleton className="h-3.5 w-16" />
    </div>
  );
}
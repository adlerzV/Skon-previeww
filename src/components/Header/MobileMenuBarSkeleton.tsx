import Skeleton from "@/components/ui/Skeleton";

export default function MobileMenuBarSkeleton() {
  return (
    <div className="w-full h-[60px] flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-md" />
      <Skeleton className="h-[30px] w-[90px]" />
      <div className="flex items-center gap-1.5">
        <Skeleton className="w-6 h-4 rounded-[2px]" />
        <Skeleton className="w-9 h-9 rounded-md" />
      </div>
    </div>
  );
}
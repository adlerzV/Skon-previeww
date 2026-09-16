import Skeleton from "@/components/ui/Skeleton";
export default function LoginPageSkeleton() {
  return (
    <div className="h-[100dvh] w-full bg-brand-bg flex flex-col overflow-hidden" dir="rtl">
      <header className="w-full flex items-center justify-between px-5 py-4 md:px-8 shrink-0">
        <Skeleton className="h-9 w-[130px]" />
        <Skeleton className="h-4 w-24" />
      </header>

      <main className="flex-1 min-h-0 w-full flex items-center justify-center p-4 md:p-5 overflow-y-auto pb-[calc(58px+env(safe-area-inset-bottom)+12px)] lg:pb-4">
        <div className="w-full max-w-md bg-brand-surface border border-brand-surface_hover p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 pb-5 border-b border-brand-surface_hover">
            <Skeleton className="h-9 w-[130px]" />
            <Skeleton className="h-4 w-28" />
          </div>

          <Skeleton className="h-11 w-full" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-12 w-full mt-1" />
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[9997] bg-[#15171e] border-t border-white/5 h-[58px] grid grid-cols-4 items-center px-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-1.5">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-8 h-2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
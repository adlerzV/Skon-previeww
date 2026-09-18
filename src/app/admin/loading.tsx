export default function Loading() {
  return (
    <div className="h-full flex flex-col gap-4 animate-pulse">
      <div className="h-28 bg-brand-surface border border-brand-surface_hover" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 bg-brand-surface border border-brand-surface_hover" />
        ))}
      </div>
      <div className="flex-1 min-h-[300px] bg-brand-surface border border-brand-surface_hover" />
    </div>
  );
}

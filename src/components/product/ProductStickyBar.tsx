"use client";

import { PriceDisplay } from "./PriceDisplay";

interface GroupedAttribute {
  name: string;
  values: { value: string; flagUrl?: string }[];
}

interface ProductStickyBarProps {
  visible: boolean;
  productName: string;
  groupedAttributes: GroupedAttribute[];
  selectedAttrs: Record<string, string>;
  onAttributeSelect: (name: string, value: string) => void;
  price: number | null;
  regularPrice: number | null;
  onCtaClick: () => void;
}

export default function ProductStickyBar({
  visible,
  productName,
  groupedAttributes,
  selectedAttrs,
  onAttributeSelect,
  price,
  regularPrice,
  onCtaClick,
}: ProductStickyBarProps) {
  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      className={`fixed top-[60px] lg:top-[80px] inset-x-0 z-[9500] bg-[#15171e]/97 backdrop-blur-md border-b border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-250 ${
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto max-w-site px-4 md:px-6 h-[58px] md:h-[64px] flex items-center gap-3 md:gap-4">
        <span className="hidden sm:block text-sm font-bold text-white truncate max-w-[160px] md:max-w-[220px] shrink-0">
          {productName}
        </span>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {groupedAttributes.map((group) => {
            const cleanName = group.name.replace("pa_", "").replace("attribute_", "");
            return (
              <select
                key={group.name}
                value={selectedAttrs[group.name] ?? ""}
                onChange={(e) => onAttributeSelect(group.name, e.target.value)}
                className="bg-brand-surface border border-brand-surface_hover text-white text-xs font-bold px-2.5 py-1.5 focus:outline-none focus:border-brand-blue cursor-pointer shrink-0 min-w-[110px]"
                aria-label={cleanName}
              >
                {group.values.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
          {typeof price === "number" ? (
            <PriceDisplay price={price} regularPrice={regularPrice ?? undefined} compact />
          ) : (
            <span className="text-red-500 font-bold text-xs whitespace-nowrap">ناموجود</span>
          )}
          <button
            type="button"
            onClick={onCtaClick}
            className="bg-brand-blue hover:bg-[#0062d1] text-white text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 whitespace-nowrap transition-colors"
          >
            مشاهده و خرید
          </button>
        </div>
      </div>
    </div>
  );
}
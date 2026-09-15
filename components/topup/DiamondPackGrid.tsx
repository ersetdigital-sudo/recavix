"use client";

import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import type { DiamondPack } from "@/types";

interface DiamondPackGridProps {
  packs: DiamondPack[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function DiamondPackGrid({
  packs,
  selectedIndex,
  onSelect,
}: DiamondPackGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {packs.map((pack, index) => {
        const active = selectedIndex === index;
        return (
          <button
            key={pack.diamonds}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className={cn(
              "relative rounded-[14px] border-[1.5px] bg-white p-3 text-left transition duration-150",
              active
                ? "border-green-d bg-mint shadow-[0_0_0_2px_rgba(79,122,74,0.25)]"
                : "border-mint-2 hover:-translate-y-0.5 hover:border-green",
            )}
          >
            {pack.tag && (
              <span className="absolute -top-2.5 right-2 rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold text-white">
                {pack.tag}
              </span>
            )}
            <span className="block font-display text-[17px] font-extrabold leading-none">
              💎 {pack.diamonds}
            </span>
            <span className="mt-1 block text-[13px] text-[#7a6a58]">
              {formatRupiah(pack.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

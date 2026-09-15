"use client";

import { cn } from "@/lib/cn";
import type { PaymentMethod } from "@/types";

interface PaymentMethodGridProps {
  methods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PaymentMethodGrid({
  methods,
  selectedId,
  onSelect,
}: PaymentMethodGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {methods.map((method) => {
        const active = selectedId === method.id;
        return (
          <button
            key={method.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border-[1.5px] bg-white px-3 py-2.5 text-left text-sm transition duration-150",
              active ? "border-green-d bg-mint" : "border-mint-2 hover:border-green",
            )}
          >
            <span
              aria-hidden
              className="grid h-6 w-[34px] flex-none place-items-center rounded-[5px] text-[10px] font-extrabold text-white"
              style={{ backgroundColor: method.color }}
            >
              {method.code}
            </span>
            {method.name}
          </button>
        );
      })}
    </div>
  );
}

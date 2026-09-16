"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setOrderStatus } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES, ORDER_STATUS_CLASS, ORDER_STATUS_LABEL, isOrderStatus } from "@/lib/orders/status";
import type { OrderStatus } from "@/types";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={pending}
        aria-label="Ubah status pesanan"
        onChange={(event) => {
          const next = event.target.value;
          if (!isOrderStatus(next)) return;

          const previous = value;
          setValue(next);
          setError(null);

          startTransition(async () => {
            const result = await setOrderStatus(orderId, next);
            if (!result.ok) {
              // Kembalikan ke nilai sebelumnya supaya select tidak menampilkan
              // status yang sebenarnya gagal tersimpan.
              setValue(previous);
              setError(result.message);
              return;
            }
            router.refresh();
          });
        }}
        className={cn(
          "cursor-pointer rounded-full border-[1.5px] px-3 py-1.5 text-[11px] font-bold outline-none transition-colors disabled:opacity-60",
          ORDER_STATUS_CLASS[value],
        )}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {ORDER_STATUS_LABEL[option]}
          </option>
        ))}
      </select>

      {error ? (
        <span role="alert" className="text-[11px] font-bold text-coral">
          {error}
        </span>
      ) : null}
    </div>
  );
}

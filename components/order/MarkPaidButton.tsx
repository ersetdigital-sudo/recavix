"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { markOrderPaid } from "@/lib/orders/actions";
import type { ActionResult } from "@/types";

export function MarkPaidButton({ invoice }: { invoice: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const marked = Boolean(status?.ok);

  return (
    <div>
      <button
        type="button"
        disabled={pending || marked}
        onClick={() => {
          const confirmed = window.confirm(
            "Tandai pesanan ini sudah dibayar? Admin akan memverifikasi mutasinya dulu.",
          );
          if (!confirmed) return;

          startTransition(async () => {
            const result = await markOrderPaid(invoice);
            setStatus(result);
            if (result.ok) router.refresh();
          });
        }}
        className="w-full rounded-xl bg-green-d py-3 font-display text-lg font-bold text-white transition-colors hover:bg-green-dd disabled:opacity-60"
      >
        {pending ? "Memproses..." : marked ? "Sudah ditandai ✓" : "Saya Sudah Bayar"}
      </button>

      {status ? (
        <p
          role="status"
          className={`mt-3 rounded-lg border px-3 py-2 text-xs font-semibold ${
            status.ok
              ? "border-green bg-mint text-green-dd"
              : "border-line bg-peach-2 text-coral-dark"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}

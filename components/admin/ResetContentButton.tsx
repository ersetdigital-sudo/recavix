"use client";

import { useState, useTransition } from "react";

import { resetContent } from "@/app/admin/actions";
import { StatusText } from "@/components/admin/fields";
import type { ActionResult } from "@/types";

export function ResetContentButton() {
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const confirmed = window.confirm(
            "Kembalikan katalog ke isi awal? Semua perubahan yang tersimpan akan dihapus.",
          );
          if (!confirmed) return;
          startTransition(async () => setStatus(await resetContent()));
        }}
        className="rounded-xl border-[1.5px] border-line bg-white px-4 py-2.5 text-xs font-bold text-coral transition-colors hover:bg-peach-2 disabled:opacity-60"
      >
        {pending ? "Mengembalikan..." : "Kembalikan ke isi awal"}
      </button>
      <StatusText status={status} />
    </div>
  );
}

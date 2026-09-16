"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/cn";
import type { ActionResult, CatalogGame } from "@/types";

interface ComingSoonToggleProps {
  /** Seluruh daftar game — aksi simpan menulis ulang satu katalog sekaligus. */
  games: CatalogGame[];
  gameIndex: number;
  /** Server action app/admin/actions.ts (saveGames). */
  action: (games: CatalogGame[]) => Promise<ActionResult>;
}

/**
 * Tombol status "Segera Hadir" langsung di daftar game.
 *
 * Sebelumnya status ini hanya bisa diubah di dalam halaman detail tiap game,
 * jadi dari daftar tidak terlihat game mana yang belum dirilis. Sekarang
 * statusnya tampil sekaligus bisa dibalik dari sini.
 */
export function ComingSoonToggle({ games, gameIndex, action }: ComingSoonToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const game = games[gameIndex];
  if (!game) return null;

  const comingSoon = game.comingSoon === true;

  const toggle = () => {
    const next = games.map((entry, index) =>
      index === gameIndex ? { ...entry, comingSoon: !comingSoon } : entry,
    );

    startTransition(async () => {
      const result = await action(next);
      if (result.ok) router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={comingSoon}
      title={
        comingSoon
          ? "Klik untuk membuka penjualan game ini"
          : "Klik untuk menandai game ini belum dirilis"
      }
      className={cn(
        "rounded-full border-[1.5px] px-3 py-1 text-[10px] font-bold transition-colors disabled:opacity-60",
        comingSoon
          ? "border-green bg-mint text-green-dd"
          : "border-mint-2 bg-white text-green-d opacity-60 hover:bg-mint hover:opacity-100",
      )}
    >
      {pending ? "Menyimpan…" : comingSoon ? "Segera Hadir" : "Bisa dibeli"}
    </button>
  );
}

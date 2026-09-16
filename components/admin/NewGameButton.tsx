"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { GAME_CATEGORIES, GAME_PLATFORMS } from "@/data/games";
import { GAME_IMAGE_FALLBACK } from "@/lib/media";
import type { ActionResult, CatalogGame } from "@/types";

interface NewGameButtonProps {
  games: CatalogGame[];
  /** Server action app/admin/actions.ts. */
  action: (games: CatalogGame[]) => Promise<ActionResult>;
}

export function NewGameButton({ games, action }: NewGameButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const create = () => {
    const slug = `game-baru-${Date.now().toString(36)}`;

    const draft: CatalogGame = {
      slug,
      name: "Game Baru",
      category: GAME_CATEGORIES[0],
      platform: GAME_PLATFORMS[0],
      image: GAME_IMAGE_FALLBACK,
      rating: 5,
      isActive: false,
      sortOrder: games.length,
    };

    startTransition(async () => {
      const result = await action([...games, draft]);
      if (result.ok) router.push(`/admin/katalog/${slug}`);
      else router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={create}
      disabled={pending}
      className="rounded-xl bg-green-d px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-dd disabled:opacity-60"
    >
      {pending ? "Menambahkan..." : "+ Tambah game"}
    </button>
  );
}

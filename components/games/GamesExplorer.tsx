"use client";

import { useMemo, useState } from "react";

import { FilterRow } from "@/components/ui/FilterRow";
import { GameCard } from "@/components/ui/GameCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { GAME_CATEGORIES, GAME_PLATFORMS, games } from "@/data/games";
import { cn } from "@/lib/cn";
import { toggleInSet } from "@/lib/collections";
import type { GameCategory, GamePlatform } from "@/types";

interface GamesExplorerProps {
  /** Pre-filled search term, e.g. when arriving from the home search box. */
  initialQuery?: string;
}

export function GamesExplorer({ initialQuery = "" }: GamesExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<Set<GameCategory>>(new Set());
  const [platforms, setPlatforms] = useState<Set<GamePlatform>>(new Set());

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return games.filter(
      (game) =>
        (categories.size === 0 || categories.has(game.category)) &&
        (platforms.size === 0 || platforms.has(game.platform)) &&
        (term === "" || game.name.toLowerCase().includes(term)),
    );
  }, [query, categories, platforms]);

  const reset = () => {
    setQuery("");
    setCategories(new Set());
    setPlatforms(new Set());
  };

  return (
    <div className="flex gap-6">
      <aside className="hidden w-[220px] flex-none lg:block">
        <SectionCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[19px] font-extrabold">Categories</h3>
            <button
              type="button"
              onClick={reset}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {GAME_CATEGORIES.map((category) => (
              <FilterRow
                key={category}
                label={category}
                checked={categories.has(category)}
                onChange={() => setCategories((prev) => toggleInSet(prev, category))}
              />
            ))}
          </div>

          <h3 className="mb-3 mt-6 text-[19px] font-extrabold">Platforms</h3>
          <div className="flex flex-col gap-2">
            {GAME_PLATFORMS.map((platform) => (
              <FilterRow
                key={platform}
                label={platform}
                checked={platforms.has(platform)}
                onChange={() => setPlatforms((prev) => toggleInSet(prev, platform))}
              />
            ))}
          </div>
        </SectionCard>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h1 className="flex items-center gap-2 text-[26px] font-extrabold">
            <span aria-hidden>🎮</span> Semua Game
          </h1>
          <span aria-live="polite" className="text-sm opacity-70">
            {filtered.length} dari {games.length} game
          </span>
        </div>

        <div className="mb-3">
          <label htmlFor="game-search" className="sr-only">
            Cari game
          </label>
          <input
            id="game-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari game, mis. Mobile Legends"
            className="field max-w-[360px]"
          />
        </div>

        <div className="mb-2 flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {GAME_CATEGORIES.map((category) => {
            const active = categories.has(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setCategories((prev) => toggleInSet(prev, category))}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-green-d bg-green-d text-white"
                    : "border-mint-2 bg-white",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((game) => (
              <GameCard key={game.slug} game={game} showMeta />
            ))}
          </div>
        ) : (
          <div className="py-14 text-center">
            <div aria-hidden className="mb-2 text-4xl">
              🫥
            </div>
            <p className="font-semibold">Game tidak ditemukan</p>
            <p className="text-sm opacity-70">
              Coba ubah kata kunci atau filter kamu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

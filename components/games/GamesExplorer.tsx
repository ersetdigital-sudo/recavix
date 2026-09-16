"use client";

import { useCallback, useMemo, useState } from "react";

import { GameFilterChips, GameFilterSidebar } from "@/components/games/GameFilterPanel";
import { GameCard } from "@/components/ui/GameCard";
import { toggleInSet } from "@/lib/collections";
import type { CatalogGame, GameCategory, GamePlatform } from "@/types";

interface GamesExplorerProps {
  /** Pre-filled search term, e.g. when arriving from the home search box. */
  initialQuery?: string;
  /** Game aktif dari katalog. */
  games: CatalogGame[];
}

export function GamesExplorer({ initialQuery = "", games }: GamesExplorerProps) {
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
  }, [games, query, categories, platforms]);

  const reset = useCallback(() => {
    setQuery("");
    setCategories(new Set<GameCategory>());
    setPlatforms(new Set<GamePlatform>());
  }, []);

  const filterValue = useMemo(() => ({ categories, platforms }), [categories, platforms]);

  return (
    <div className="flex gap-6">
      <GameFilterSidebar
        games={games}
        value={filterValue}
        onToggleCategory={(category: GameCategory) =>
          setCategories((prev) => toggleInSet(prev, category))
        }
        onTogglePlatform={(platform: GamePlatform) =>
          setPlatforms((prev) => toggleInSet(prev, platform))
        }
        onReset={reset}
        hasil={filtered.length}
      />

      <div className="min-w-0 flex-1">
        <h1 className="mb-3 flex items-center gap-2 text-[26px] font-extrabold">
          <span aria-hidden>🎮</span> Semua Game
        </h1>

        <div className="mb-1">
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

        <div className="mt-3">
          <GameFilterChips
            games={games}
            value={filterValue}
            onToggleCategory={(category: GameCategory) =>
              setCategories((prev) => toggleInSet(prev, category))
            }
            onTogglePlatform={(platform: GamePlatform) =>
              setPlatforms((prev) => toggleInSet(prev, platform))
            }
            onReset={reset}
            hasil={filtered.length}
          />
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
            <p className="text-sm opacity-70">Coba ubah kata kunci atau filter kamu.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-sm font-bold text-green-d underline"
            >
              Tampilkan semua game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

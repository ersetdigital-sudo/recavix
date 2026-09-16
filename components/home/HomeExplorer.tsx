"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { GameFilterChips, GameFilterSidebar } from "@/components/games/GameFilterPanel";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { GameCard } from "@/components/ui/GameCard";
import { Reveal } from "@/components/ui/Reveal";
import { toggleInSet } from "@/lib/collections";
import type { CatalogGame, GameCategory, GamePlatform, HeroSlide } from "@/types";

interface HomeExplorerProps {
  /** Game aktif dari katalog — dikirim server component supaya bisa diubah dari dashboard. */
  games: CatalogGame[];
  /** Slide banner aktif dari dashboard. */
  heroSlides: HeroSlide[];
}

export function HomeExplorer({ games, heroSlides }: HomeExplorerProps) {
  // Tanpa filter terpilih, beranda langsung menampilkan seluruh game aktif.
  const [categories, setCategories] = useState<Set<GameCategory>>(() => new Set<GameCategory>());
  const [platforms, setPlatforms] = useState<Set<GamePlatform>>(() => new Set<GamePlatform>());

  const filtered = useMemo(
    () =>
      games.filter(
        (game) =>
          (categories.size === 0 || categories.has(game.category)) &&
          (platforms.size === 0 || platforms.has(game.platform)),
      ),
    [games, categories, platforms],
  );

  const reset = useCallback(() => {
    setCategories(new Set<GameCategory>());
    setPlatforms(new Set<GamePlatform>());
  }, []);

  const filterValue = useMemo(() => ({ categories, platforms }), [categories, platforms]);

  // Judul mengikuti filter yang aktif, jadi terlihat apa yang sedang disaring.
  const heading = useMemo(() => {
    const labels = [...categories, ...platforms];
    return labels.length === 0 ? "Semua Game" : labels.join(" · ");
  }, [categories, platforms]);

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
        <HeroCarousel slides={heroSlides} />

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

        <h2
          id="games"
          className="mb-4 mt-2 flex items-center gap-2 text-[22px] font-extrabold"
        >
          <span aria-hidden>🎮</span> {heading}
        </h2>

        {filtered.length > 0 ? (
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="rounded-2xl border border-mint-2 bg-white py-14 text-center">
            <div aria-hidden className="mb-2 text-4xl">
              🫥
            </div>
            <p className="font-semibold">Belum ada game di filter ini</p>
            <p className="text-sm opacity-70">Coba pilih kategori atau platform lain.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-sm font-bold text-green-d underline"
            >
              Tampilkan semua game
            </button>
          </div>
        )}

        <div className="my-8 text-center">
          <Link
            href="/games"
            className="inline-block rounded-xl bg-green-d px-8 py-3 font-display text-lg font-bold text-white transition-colors hover:bg-green-dd"
          >
            Lihat Semua Game
          </Link>
        </div>
      </div>
    </div>
  );
}

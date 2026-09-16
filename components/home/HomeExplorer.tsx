"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FilterRow } from "@/components/ui/FilterRow";
import { GameCard } from "@/components/ui/GameCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionCard } from "@/components/ui/SectionCard";
import { GAME_CATEGORIES, GAME_PLATFORMS } from "@/data/games";
import { cn } from "@/lib/cn";
import { toggleInSet } from "@/lib/collections";
import type { CatalogGame, GameCategory, GamePlatform, HeroSlide } from "@/types";

interface HomeExplorerProps {
  /** Game aktif dari katalog — dikirim server component supaya bisa diubah dari dashboard. */
  games: CatalogGame[];
  /** Slide banner aktif dari dashboard. */
  heroSlides: HeroSlide[];
}

export function HomeExplorer({ games, heroSlides }: HomeExplorerProps) {
  const [categories, setCategories] = useState<Set<GameCategory>>(
    () => new Set<GameCategory>(["Moba Game"]),
  );
  const [platforms, setPlatforms] = useState<Set<GamePlatform>>(
    () => new Set<GamePlatform>(),
  );

  const filtered = useMemo(
    () =>
      games.filter(
        (game) =>
          (categories.size === 0 || categories.has(game.category)) &&
          (platforms.size === 0 || platforms.has(game.platform)),
      ),
    [games, categories, platforms],
  );

  const heading =
    categories.size === 0 ? "Semua Game" : [...categories].join(", ");

  return (
    <div className="flex gap-6">
      <aside className="hidden w-[220px] flex-none lg:block">
        <SectionCard className="p-4">
          <h3 className="mb-3 text-[19px] font-extrabold">Categories</h3>
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
        <HeroCarousel slides={heroSlides} />

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
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
            <p className="text-sm opacity-70">
              Coba pilih kategori atau platform lain.
            </p>
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

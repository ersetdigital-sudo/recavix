"use client";

import { availableCategories, availablePlatforms } from "@/data/games";
import { cn } from "@/lib/cn";
import type { CatalogGame, GameCategory, GamePlatform } from "@/types";

/** Nilai yang dipakai bersama oleh panel desktop dan chip mobile. */
export interface GameFilterValue {
  categories: Set<GameCategory>;
  platforms: Set<GamePlatform>;
}

interface CommonProps {
  /** Seluruh game katalog, termasuk yang segera hadir — dasar hitungan. */
  games: CatalogGame[];
  value: GameFilterValue;
  onToggleCategory: (category: GameCategory) => void;
  onTogglePlatform: (platform: GamePlatform) => void;
  onReset: () => void;
  /** Jumlah game yang lolos filter saat ini. */
  hasil: number;
}

const countBy = <T extends string>(games: CatalogGame[], key: "category" | "platform") => {
  const counts = new Map<T, number>();
  for (const game of games) {
    const value = game[key] as T;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const hasActiveFilter = (value: GameFilterValue) =>
  value.categories.size > 0 || value.platforms.size > 0;

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl border-[1.5px] px-2.5 py-2 text-left text-[13px] font-semibold transition-colors",
        active
          ? "border-green bg-mint text-green-dd"
          : "border-transparent bg-cream hover:border-mint-2 hover:bg-mint/70",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid h-4 w-4 flex-none place-items-center rounded-[5px] border-[1.5px] text-[10px] leading-none",
          active ? "border-green-d bg-green-d text-white" : "border-line bg-white",
        )}
      >
        {active ? "✓" : ""}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span
        className={cn(
          "flex-none rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
          active ? "bg-white text-green-dd" : "bg-white text-green-d opacity-70",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border-[1.5px] px-3 py-1.5 text-[13px] font-semibold transition-colors",
        active ? "border-green-d bg-green-d text-white" : "border-mint-2 bg-white text-green-d",
      )}
    >
      {label}
    </button>
  );
}

/**
 * Panel filter di sisi kiri (desktop).
 *
 * Isi pilihannya mengikuti katalog — kategori atau platform yang tidak dipakai
 * satu game pun tidak ikut tampil, jadi tidak ada filter yang menjamin hasil
 * kosong. Jumlah game ditulis di tiap baris supaya terlihat sebelum diklik.
 */
export function GameFilterSidebar(props: CommonProps) {
  const { games, value, onToggleCategory, onTogglePlatform, onReset, hasil } = props;

  const categories = availableCategories(games);
  const platforms = availablePlatforms(games);
  const categoryCounts = countBy<GameCategory>(games, "category");
  const platformCounts = countBy<GamePlatform>(games, "platform");

  return (
    <aside className="hidden w-[236px] flex-none self-start lg:block">
      <div className="card-shadow sticky top-6 rounded-2xl border border-mint-2 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-display text-[17px] font-extrabold">Filter</h3>
          {hasActiveFilter(value) ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border-[1.5px] border-mint-2 px-2.5 py-1 text-[11px] font-bold text-green-d transition-colors hover:bg-mint"
            >
              Reset
            </button>
          ) : null}
        </div>

        {categories.length > 0 ? (
          <section aria-label="Kategori" className="mb-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider opacity-50">
              Kategori
            </p>
            <div className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <FilterRow
                  key={category}
                  label={category}
                  count={categoryCounts.get(category) ?? 0}
                  active={value.categories.has(category)}
                  onClick={() => onToggleCategory(category)}
                />
              ))}
            </div>
          </section>
        ) : null}

        {platforms.length > 0 ? (
          <section aria-label="Platform">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider opacity-50">
              Platform
            </p>
            <div className="flex flex-col gap-1.5">
              {platforms.map((platform) => (
                <FilterRow
                  key={platform}
                  label={platform}
                  count={platformCounts.get(platform) ?? 0}
                  active={value.platforms.has(platform)}
                  onClick={() => onTogglePlatform(platform)}
                />
              ))}
            </div>
          </section>
        ) : null}

        <p
          aria-live="polite"
          className="mt-4 border-t border-mint-2 pt-3 text-[11px] font-semibold opacity-65"
        >
          Menampilkan {hasil} dari {games.length} game
        </p>
      </div>
    </aside>
  );
}

/**
 * Versi mobile: dua baris chip yang bisa di-scroll.
 *
 * Platform ikut ditampilkan di sini — sebelumnya mobile hanya punya kategori,
 * jadi filter yang sama berperilaku berbeda antara HP dan desktop.
 */
export function GameFilterChips(props: CommonProps) {
  const { games, value, onToggleCategory, onTogglePlatform, onReset, hasil } = props;

  const categories = availableCategories(games);
  const platforms = availablePlatforms(games);

  if (categories.length === 0 && platforms.length === 0) return null;

  return (
    <div className="mb-4 lg:hidden">
      {categories.length > 0 ? (
        <div className="mb-2">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
            Kategori
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                active={value.categories.has(category)}
                onClick={() => onToggleCategory(category)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {platforms.length > 0 ? (
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
            Platform
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {platforms.map((platform) => (
              <FilterChip
                key={platform}
                label={platform}
                active={value.platforms.has(platform)}
                onClick={() => onTogglePlatform(platform)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold opacity-65">
        <span aria-live="polite">
          Menampilkan {hasil} dari {games.length} game
        </span>
        {hasActiveFilter(value) ? (
          <button type="button" onClick={onReset} className="underline">
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

import { unstable_cache } from "next/cache";

import { CACHE_EPOCH, CONTENT_TAG } from "@/lib/cache";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type { CatalogGame, CatalogPack, GameCategory, GamePlatform } from "@/types";

import { DEFAULT_GAMES, defaultPacksFor } from "./defaults";
import { readIdFields, stringifySecondOptions } from "./id-fields";

interface GameRow {
  slug: string;
  name: string;
  category: string;
  platform: string;
  image: string;
  rating: number | string;
  is_active: boolean;
  coming_soon: boolean;
  id_label: string;
  second_kind: string;
  second_label: string;
  second_options: string;
  sort_order: number;
}

interface PackRow {
  id: string;
  game_slug: string;
  diamonds: number;
  price: number;
  tag: string | null;
  is_active: boolean;
  sort_order: number;
}

const toGame = (row: GameRow): CatalogGame => ({
  slug: row.slug,
  name: row.name,
  category: row.category as GameCategory,
  platform: row.platform as GamePlatform,
  image: row.image,
  rating: Number(row.rating),
  // Baris lama yang belum punya nilai dianggap aktif.
  isActive: row.is_active !== false,
  comingSoon: row.coming_soon === true,
  ...readIdFields({
    idLabel: row.id_label,
    secondKind: row.second_kind,
    secondLabel: row.second_label,
    secondOptions: row.second_options,
  }),
  sortOrder: row.sort_order ?? 0,
});

const toPack = (row: PackRow): CatalogPack => ({
  id: row.id,
  gameSlug: row.game_slug,
  diamonds: row.diamonds,
  price: row.price,
  tag: row.tag ?? undefined,
  isActive: row.is_active !== false,
  sortOrder: row.sort_order ?? 0,
});

export interface CatalogSnapshot {
  games: CatalogGame[];
  packs: CatalogPack[];
  /** Diisi kalau tabel gagal dibaca — ditampilkan di dashboard admin. */
  error: string | null;
}

/** Selalu membaca sumber terbaru — untuk halaman admin yang tidak boleh kena cache. */
export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  if (!isSupabaseConfigured()) {
    return { games: DEFAULT_GAMES, packs: [], error: null };
  }

  try {
    const [gamesResponse, packsResponse] = await Promise.all([
      supabaseFetch("games?select=*&order=sort_order.asc"),
      supabaseFetch("diamond_packs?select=*&order=game_slug.asc,sort_order.asc"),
    ]);

    const gameRows = (await gamesResponse.json()) as GameRow[];
    // Baris lama yang belum punya game_slug dilewati supaya tidak muncul di
    // daftar game mana pun — paket sekarang selalu milik satu game.
    const packRows = ((await packsResponse.json()) as PackRow[]).filter((row) =>
      Boolean(row.game_slug),
    );

    return {
      // Tabel kosong berarti admin belum pernah menyimpan — pakai isi bawaan.
      games: gameRows.length > 0 ? gameRows.map(toGame) : DEFAULT_GAMES,
      packs: packRows.map(toPack),
      error: null,
    };
  } catch (error) {
    console.error("[katalog] gagal dibaca:", error);
    return {
      games: DEFAULT_GAMES,
      packs: [],
      error: "Katalog gagal dimuat dari penyimpanan.",
    };
  }
}

/** Paket yang benar-benar dipakai satu game: baris tersimpan, atau bawaan kalau belum ada. */
export function packsForGame(packs: CatalogPack[], gameSlug: string): CatalogPack[] {
  const saved = packs.filter((pack) => pack.gameSlug === gameSlug);
  return saved.length > 0 ? saved : defaultPacksFor(gameSlug);
}

/**
 * Versi ber-cache untuk halaman publik. Hanya yang aktif yang sampai ke pembeli.
 * Di-invalidasi lewat revalidateTag(CONTENT_TAG) setiap admin menyimpan.
 */
export const getCachedCatalog = unstable_cache(
  async () => {
    const { games, packs } = await getCatalogSnapshot();
    const activeGames = games.filter((game) => game.isActive);
    const activePacks = packs.filter((pack) => pack.isActive);

    // Paket dikelompokkan per game supaya checkout cukup membaca milik game
    // yang sedang dipilih, bukan seluruh katalog.
    const packsByGame: Record<string, CatalogPack[]> = {};
    for (const game of activeGames) {
      packsByGame[game.slug] = packsForGame(activePacks, game.slug);
    }

    return { games: activeGames, packsByGame };
  },
  ["recavix-catalog", CACHE_EPOCH],
  { tags: [CONTENT_TAG] },
);

export async function readActiveGames(): Promise<CatalogGame[]> {
  return (await getCachedCatalog()).games;
}

/** Paket aktif milik satu game — dipakai checkout dan pembuatan pesanan. */
export async function readActivePacks(gameSlug: string): Promise<CatalogPack[]> {
  return (await getCachedCatalog()).packsByGame[gameSlug] ?? [];
}

/** Semua paket aktif, dikelompokkan per slug game. */
export async function readActivePacksByGame(): Promise<Record<string, CatalogPack[]>> {
  return (await getCachedCatalog()).packsByGame;
}

/**
 * Ganti utuh katalog game: cukup untuk satu admin, dan menghindari perbedaan
 * antara daftar di form dan isi tabel.
 */
export async function writeGames(games: CatalogGame[]): Promise<void> {
  const rows = games.map((game, index) => ({
    slug: game.slug,
    name: game.name,
    category: game.category,
    platform: game.platform,
    image: game.image,
    rating: game.rating,
    is_active: game.isActive,
    coming_soon: game.comingSoon,
    id_label: game.idLabel,
    second_kind: game.secondKind,
    second_label: game.secondLabel,
    second_options: stringifySecondOptions(game.secondOptions),
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    await supabaseFetch("games", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
  }

  // Hapus game yang sudah tidak ada di daftar.
  const keep = games.map((game) => game.slug);
  const notIn = keep.length > 0 ? `&slug=not.in.(${keep.join(",")})` : "";
  await supabaseFetch(`games?select=slug${notIn}`, { method: "DELETE" });
}

export async function writePacks(gameSlug: string, packs: CatalogPack[]): Promise<void> {
  const rows = packs.map((pack, index) => ({
    id: pack.id,
    game_slug: gameSlug,
    diamonds: pack.diamonds,
    price: pack.price,
    tag: pack.tag ?? null,
    is_active: pack.isActive,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    await supabaseFetch("diamond_packs", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
  }

  // Hapus paket game ini yang sudah tidak ada di daftar — game lain tidak disentuh.
  const keep = packs.map((pack) => pack.id);
  const notIn = keep.length > 0 ? `&id=not.in.(${keep.join(",")})` : "";
  await supabaseFetch(
    `diamond_packs?select=id&game_slug=eq.${encodeURIComponent(gameSlug)}${notIn}`,
    { method: "DELETE" },
  );
}

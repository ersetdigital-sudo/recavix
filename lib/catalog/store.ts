import { unstable_cache } from "next/cache";

import { CONTENT_TAG } from "@/lib/cache";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type { CatalogGame, CatalogPack, GameCategory, GamePlatform } from "@/types";

import { DEFAULT_GAMES, DEFAULT_PACKS } from "./defaults";

interface GameRow {
  slug: string;
  name: string;
  category: string;
  platform: string;
  image: string;
  rating: number | string;
  is_active: boolean;
  sort_order: number;
}

interface PackRow {
  id: string;
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
  sortOrder: row.sort_order ?? 0,
});

const toPack = (row: PackRow): CatalogPack => ({
  id: row.id,
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
    return { games: DEFAULT_GAMES, packs: DEFAULT_PACKS, error: null };
  }

  try {
    const [gamesResponse, packsResponse] = await Promise.all([
      supabaseFetch("games?select=*&order=sort_order.asc"),
      supabaseFetch("diamond_packs?select=*&order=sort_order.asc"),
    ]);

    const gameRows = (await gamesResponse.json()) as GameRow[];
    const packRows = (await packsResponse.json()) as PackRow[];

    return {
      // Tabel kosong berarti admin belum pernah menyimpan — pakai isi bawaan.
      games: gameRows.length > 0 ? gameRows.map(toGame) : DEFAULT_GAMES,
      packs: packRows.length > 0 ? packRows.map(toPack) : DEFAULT_PACKS,
      error: null,
    };
  } catch (error) {
    console.error("[katalog] gagal dibaca:", error);
    return {
      games: DEFAULT_GAMES,
      packs: DEFAULT_PACKS,
      error: "Katalog gagal dimuat dari penyimpanan.",
    };
  }
}

/**
 * Versi ber-cache untuk halaman publik. Hanya yang aktif yang sampai ke pembeli.
 * Di-invalidasi lewat revalidateTag(CONTENT_TAG) setiap admin menyimpan.
 */
export const getCachedCatalog = unstable_cache(
  async () => {
    const { games, packs } = await getCatalogSnapshot();
    return {
      games: games.filter((game) => game.isActive),
      packs: packs.filter((pack) => pack.isActive),
    };
  },
  ["recavix-catalog"],
  { tags: [CONTENT_TAG] },
);

export async function readActiveGames(): Promise<CatalogGame[]> {
  return (await getCachedCatalog()).games;
}

export async function readActivePacks(): Promise<CatalogPack[]> {
  return (await getCachedCatalog()).packs;
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

export async function writePacks(packs: CatalogPack[]): Promise<void> {
  const rows = packs.map((pack, index) => ({
    id: pack.id,
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

  const keep = packs.map((pack) => pack.id);
  const notIn = keep.length > 0 ? `&id=not.in.(${keep.join(",")})` : "";
  await supabaseFetch(`diamond_packs?select=id${notIn}`, { method: "DELETE" });
}

import { diamondPacks } from "@/data/diamond-packs";
import { games } from "@/data/games";
import type { CatalogGame, CatalogPack } from "@/types";

/**
 * Isi bawaan yang dibaca langsung dari `data/`.
 *
 * Dipakai selama admin belum pernah menyimpan apa pun (tabel masih kosong),
 * dan menjadi target tombol "kembalikan ke isi awal". Nilainya sengaja tetap
 * ditulis sebagai TypeScript di `data/` supaya tetap type-checked.
 */
export const DEFAULT_GAMES: CatalogGame[] = games.map((game, index) => ({
  ...game,
  isActive: true,
  sortOrder: index,
}));

export const DEFAULT_PACKS: CatalogPack[] = diamondPacks.map((pack, index) => ({
  ...pack,
  id: `pack-${pack.diamonds}`,
  isActive: true,
  sortOrder: index,
}));

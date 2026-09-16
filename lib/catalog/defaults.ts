import { diamondPacks } from "@/data/diamond-packs";
import { games } from "@/data/games";
import type { CatalogGame, CatalogPack } from "@/types";

import { readIdFields } from "./id-fields";

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
  comingSoon: game.comingSoon === true,
  ...readIdFields(game),
  sortOrder: index,
}));

/**
 * Paket bawaan untuk satu game.
 *
 * Dipakai selama game itu belum punya baris sendiri di `diamond_packs`, dan
 * jadi titik awal editor di `/admin/paket` supaya admin tidak mulai dari kosong.
 * Daftar nominalnya sama untuk semua game; harganya tinggal diubah per game.
 */
export function defaultPacksFor(gameSlug: string): CatalogPack[] {
  return diamondPacks.map((pack, index) => ({
    ...pack,
    id: `pack-${pack.diamonds}`,
    gameSlug,
    isActive: true,
    sortOrder: index,
  }));
}

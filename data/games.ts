import type { Game, GameCategory, GamePlatform } from "@/types";

export const GAME_CATEGORIES: GameCategory[] = [
  "Battle Royale",
  "Adventure",
  "Moba Game",
  "RPG",
  "Casual Game",
  "Strategy",
  "Simulator",
  "Sports Game",
];

export const GAME_PLATFORMS: GamePlatform[] = [
  "Smartphone",
  "PC",
  "Nintendo",
  "Playstation 4",
  "Playstation 5",
  "X-Box",
];

/**
 * Single source of truth for the catalogue.
 * Add a new game here — no component changes required.
 * Drop its thumbnail in `public/images/games/<slug>.png`.
 *
 * Semua game di daftar ini otomatis muncul di katalog, beranda, dan di selector
 * checkout. Menambah game dari dashboard admin juga langsung bisa dijual.
 *
 * Kolom yang diminta di checkout BEDA per game — di bawah ini hasil pengecekan
 * langsung ke form distributor resminya, bukan asumsi:
 *
 * - Mobile Legends & Magic Chess : `User ID` + `Zone ID` (form Codashop punya
 *   input bernama `zoneId`)
 * - Genshin Impact               : `UID` + pilih `Server` — Genshin TIDAK punya
 *   Zone ID, yang kedua itu pilihan server (Asia/America/Europe/TW,HK,MO)
 * - PUBG Mobile                  : `Player ID` saja (toko resmi Midasbuy)
 * - Free Fire                    : `Player ID` saja (form Codashop hanya 1 kolom)
 * - Roblox                       : `Username`
 * - Honor of Kings & Dota 2      : belum terverifikasi dari sumber resmi, jadi
 *   dipakai nilai paling umum dan bisa diubah dari dashboard
 *
 * Semuanya bisa diubah dari dashboard (Katalog → game → bagian ID checkout).
 */
export const games: Game[] = [
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    category: "Battle Royale",
    platform: "Smartphone",
    image: "/images/games/pubg-mobile.png",
    rating: 5,
    idLabel: "Player ID",
    secondKind: "none",
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    category: "Moba Game",
    platform: "Smartphone",
    image: "/images/games/mobile-legends.png",
    rating: 5,
    idLabel: "User ID",
    secondKind: "text",
    secondLabel: "Zone ID",
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    category: "Battle Royale",
    platform: "Smartphone",
    image: "/images/games/free-fire.png",
    rating: 5,
    idLabel: "Player ID",
    secondKind: "none",
  },
  {
    // Ikon menyusul: unggah dari dashboard (Katalog → game ini → Ikon).
    slug: "magic-chess",
    name: "Magic Chess",
    category: "Strategy",
    platform: "Smartphone",
    image: "",
    rating: 5,
    idLabel: "User ID",
    secondKind: "text",
    secondLabel: "Zone ID",
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    category: "Moba Game",
    platform: "Smartphone",
    image: "/images/games/honor-of-kings.png",
    rating: 5,
    idLabel: "Player ID",
    secondKind: "none",
  },
  {
    slug: "roblox",
    name: "Roblox",
    category: "Casual Game",
    platform: "PC",
    image: "/images/games/roblox.png",
    rating: 5,
    idLabel: "Username",
    secondKind: "none",
  },
  /*
   * Game yang belum diluncurkan di Recavix. Tampil di beranda dan katalog dengan
   * badge "Segera Hadir" supaya katalog tidak terasa kosong, tapi tidak bisa
   * dipilih di checkout. Nyalakan tombol belinya dari dashboard begitu siap.
   */
  {
    slug: "dota-2",
    name: "Dota 2",
    category: "Moba Game",
    platform: "PC",
    image: "/images/games/dota-2.png",
    rating: 5,
    comingSoon: true,
    idLabel: "Steam ID",
    secondKind: "none",
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    category: "RPG",
    platform: "PC",
    image: "/images/games/genshin-impact.png",
    rating: 5,
    comingSoon: true,
    idLabel: "UID",
    secondKind: "select",
    secondLabel: "Server",
    secondOptions: ["Asia", "America", "Europe", "TW/HK/MO"],
  },
];

export const getGamesByCategory = (category: GameCategory): Game[] =>
  games.filter((game) => game.category === category);

export const getGameBySlug = (slug: string): Game | undefined =>
  games.find((game) => game.slug === slug);

/**
 * Filter di beranda dan katalog hanya menampilkan pilihan yang benar-benar
 * dipakai katalog. Tanpa ini, kategori kosong tetap tampil dan terlihat seperti
 * game yang hilang.
 */
export const availableCategories = (items: { category: GameCategory }[]): GameCategory[] =>
  GAME_CATEGORIES.filter((category) => items.some((game) => game.category === category));

export const availablePlatforms = (items: { platform: GamePlatform }[]): GamePlatform[] =>
  GAME_PLATFORMS.filter((platform) => items.some((game) => game.platform === platform));

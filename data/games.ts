import type { Game, GameCategory, GamePlatform } from "@/types";

export const GAME_CATEGORIES: GameCategory[] = [
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
 */
export const games: Game[] = [
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    category: "Adventure",
    platform: "Smartphone",
    image: "/images/games/pubg-mobile.png",
    rating: 5,
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    category: "Moba Game",
    platform: "Smartphone",
    image: "/images/games/mobile-legends.png",
    rating: 5,
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    category: "Adventure",
    platform: "Smartphone",
    image: "/images/games/free-fire.png",
    rating: 5,
  },
  {
    // Ikon menyusul: unggah dari dashboard (Katalog → game ini → Ikon).
    slug: "magic-chess",
    name: "Magic Chess",
    category: "Strategy",
    platform: "Smartphone",
    image: "",
    rating: 5,
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    category: "Moba Game",
    platform: "Smartphone",
    image: "/images/games/honor-of-kings.png",
    rating: 5,
  },
  {
    slug: "roblox",
    name: "Roblox",
    category: "Casual Game",
    platform: "PC",
    image: "/images/games/roblox.png",
    rating: 5,
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

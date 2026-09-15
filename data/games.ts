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
 */
export const games: Game[] = [
  { slug: "arena-of-valor", name: "Arena of Valor", category: "Moba Game", platform: "Smartphone", image: "/images/games/arena-of-valor.png", rating: 5 },
  { slug: "dota-2", name: "Dota 2", category: "Moba Game", platform: "PC", image: "/images/games/dota-2.png", rating: 5 },
  { slug: "honor-of-kings", name: "Honor of Kings", category: "Moba Game", platform: "Smartphone", image: "/images/games/honor-of-kings.png", rating: 5 },
  { slug: "mobile-legends", name: "Mobile Legends", category: "Moba Game", platform: "Smartphone", image: "/images/games/mobile-legends.png", rating: 5 },
  { slug: "pokemon-unite", name: "Pokemon Unite", category: "Moba Game", platform: "Nintendo", image: "/images/games/pokemon-unite.png", rating: 5 },
  { slug: "heroes-evolved", name: "Heroes Evolved", category: "Moba Game", platform: "Smartphone", image: "/images/games/heroes-evolved.png", rating: 5 },
  { slug: "vainglory", name: "Vainglory", category: "Moba Game", platform: "Smartphone", image: "/images/games/vainglory.png", rating: 5 },
  { slug: "onmyoji-arena", name: "Onmyoji Arena", category: "Moba Game", platform: "Smartphone", image: "/images/games/onmyoji-arena.png", rating: 5 },
  { slug: "genshin-impact", name: "Genshin Impact", category: "RPG", platform: "PC", image: "/images/games/genshin-impact.png", rating: 5 },
  { slug: "honkai-star-rail", name: "Honkai Star Rail", category: "RPG", platform: "Smartphone", image: "/images/games/honkai-star-rail.png", rating: 5 },
  { slug: "final-fantasy-xiv", name: "Final Fantasy XIV", category: "RPG", platform: "Playstation 5", image: "/images/games/final-fantasy-xiv.png", rating: 5 },
  { slug: "ragnarok-m", name: "Ragnarok M", category: "RPG", platform: "Smartphone", image: "/images/games/ragnarok-m.png", rating: 5 },
  { slug: "free-fire", name: "Free Fire", category: "Adventure", platform: "Smartphone", image: "/images/games/free-fire.png", rating: 5 },
  { slug: "pubg-mobile", name: "PUBG Mobile", category: "Adventure", platform: "Smartphone", image: "/images/games/pubg-mobile.png", rating: 5 },
  { slug: "call-of-duty-mobile", name: "Call of Duty Mobile", category: "Adventure", platform: "Smartphone", image: "/images/games/call-of-duty-mobile.png", rating: 5 },
  { slug: "minecraft", name: "Minecraft", category: "Simulator", platform: "X-Box", image: "/images/games/minecraft.png", rating: 5 },
  { slug: "the-sims-4", name: "The Sims 4", category: "Simulator", platform: "PC", image: "/images/games/the-sims-4.png", rating: 5 },
  { slug: "stardew-valley", name: "Stardew Valley", category: "Simulator", platform: "Nintendo", image: "/images/games/stardew-valley.png", rating: 5 },
  { slug: "clash-of-clans", name: "Clash of Clans", category: "Strategy", platform: "Smartphone", image: "/images/games/clash-of-clans.png", rating: 5 },
  { slug: "clash-royale", name: "Clash Royale", category: "Strategy", platform: "Smartphone", image: "/images/games/clash-royale.png", rating: 5 },
  { slug: "rise-of-kingdoms", name: "Rise of Kingdoms", category: "Strategy", platform: "Smartphone", image: "/images/games/rise-of-kingdoms.png", rating: 5 },
  { slug: "candy-crush-saga", name: "Candy Crush Saga", category: "Casual Game", platform: "Smartphone", image: "/images/games/candy-crush-saga.png", rating: 5 },
  { slug: "among-us", name: "Among Us", category: "Casual Game", platform: "Nintendo", image: "/images/games/among-us.png", rating: 5 },
  { slug: "roblox", name: "Roblox", category: "Casual Game", platform: "PC", image: "/images/games/roblox.png", rating: 5 },
  { slug: "efootball", name: "eFootball", category: "Sports Game", platform: "Playstation 5", image: "/images/games/efootball.png", rating: 5 },
  { slug: "ea-fc-mobile", name: "EA FC Mobile", category: "Sports Game", platform: "Smartphone", image: "/images/games/ea-fc-mobile.png", rating: 5 },
  { slug: "nba-2k", name: "NBA 2K", category: "Sports Game", platform: "Playstation 4", image: "/images/games/nba-2k.png", rating: 5 },
  { slug: "rocket-league", name: "Rocket League", category: "Sports Game", platform: "X-Box", image: "/images/games/rocket-league.png", rating: 5 },
];

export const getGamesByCategory = (category: GameCategory): Game[] =>
  games.filter((game) => game.category === category);

export const getGameBySlug = (slug: string): Game | undefined =>
  games.find((game) => game.slug === slug);

/** Games exposed in the checkout game selector. */
export const CHECKOUT_GAME_SLUGS = [
  "mobile-legends",
  "arena-of-valor",
  "honor-of-kings",
  "pokemon-unite",
  "dota-2",
  "free-fire",
] as const;

export const checkoutGames: Game[] = CHECKOUT_GAME_SLUGS.map((slug) =>
  getGameBySlug(slug),
).filter((game): game is Game => Boolean(game));

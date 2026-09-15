export type GameCategory =
  | "Adventure"
  | "Moba Game"
  | "RPG"
  | "Casual Game"
  | "Strategy"
  | "Simulator"
  | "Sports Game";

export type GamePlatform =
  | "Smartphone"
  | "PC"
  | "Nintendo"
  | "Playstation 4"
  | "Playstation 5"
  | "X-Box";

export interface Game {
  slug: string;
  name: string;
  category: GameCategory;
  platform: GamePlatform;
  /** Path inside /public, e.g. `/images/games/mobile-legends.png`. */
  image: string;
  rating: number;
}

export interface DiamondPack {
  diamonds: number;
  price: number;
  /** Optional marketing badge rendered on the pack, e.g. "POPULER". */
  tag?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  /** Brand colour used for the icon chip. */
  color: string;
  /** 2–3 letter code shown inside the icon chip. */
  code: string;
}

export interface PromoCode {
  code: string;
  /** Discount as a fraction, e.g. 0.1 for 10%. */
  discount: number;
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export type TransactionStatus = "success" | "pending" | "failed";

export interface TransactionStep {
  label: string;
  time: string;
}

export interface Transaction {
  id: string;
  status: TransactionStatus;
  game: string;
  item: string;
  account: string;
  payment: string;
  total: string;
  date: string;
  /** Ordered timeline steps. */
  steps: TransactionStep[];
  /** How many leading steps are completed. */
  done: number;
}

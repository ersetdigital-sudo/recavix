export type GameCategory =
  | "Battle Royale"
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

/**
 * Bentuk kolom ID kedua di form checkout.
 *
 * Tiap game butuh data berbeda: Mobile Legends memakai Zone ID, Genshin Impact
 * memilih Server, sedangkan PUBG/Free Fire/Roblox cukup satu kolom ID saja.
 */
export type SecondIdKind = "none" | "text" | "select";

export interface Game {
  slug: string;
  name: string;
  category: GameCategory;
  platform: GamePlatform;
  /** Path inside /public, e.g. `/images/games/mobile-legends.png`. */
  image: string;
  rating: number;
  /**
   * Game yang belum diluncurkan. Tetap tampil di beranda dan katalog dengan
   * badge "Segera Hadir", tapi tidak bisa dipilih di checkout.
   */
  comingSoon?: boolean;
  /** Label kolom ID pertama, mis. "User ID" / "UID" / "Player ID" / "Username". */
  idLabel?: string;
  /** Kolom kedua: tidak ada, isian bebas, atau pilihan. */
  secondKind?: SecondIdKind;
  /** Label kolom kedua, mis. "Zone ID" atau "Server". */
  secondLabel?: string;
  /** Pilihan yang muncul saat secondKind = "select". */
  secondOptions?: string[];
}

export interface DiamondPack {
  diamonds: number;
  price: number;
  /** Optional marketing badge rendered on the pack, e.g. "POPULER". */
  tag?: string;
}

/** Game seperti yang tersimpan di katalog — punya flag tampil dan urutan. */
export interface CatalogGame extends Game {
  isActive: boolean;
  /** Sudah dinormalkan, jadi selalu ada nilainya. */
  comingSoon: boolean;
  sortOrder: number;
  /** Sudah dinormalkan dari `Game` — selalu terisi. */
  idLabel: string;
  secondKind: SecondIdKind;
  secondLabel: string;
  secondOptions: string[];
}

/** Paket diamond seperti yang tersimpan di katalog — selalu milik satu game. */
export interface CatalogPack extends DiamondPack {
  id: string;
  /** Slug game pemilik paket ini. Harga diatur per game. */
  gameSlug: string;
  isActive: boolean;
  sortOrder: number;
}

export type PaymentType = "qris" | "transfer";

/** Bentuk lengkap yang disimpan di database dan dipakai seluruh halaman. */
export interface PaymentMethod {
  id: string;
  name: string;
  /** Brand colour used for the icon chip. */
  color: string;
  /** 2–3 letter code shown inside the icon chip. */
  code: string;
  /** "qris" menampilkan gambar QR, "transfer" menampilkan nomor tujuan. */
  type: PaymentType;
  /** Label nomor tujuan, contoh "Nomor Virtual Account BCA". */
  accountLabel: string;
  accountNumber: string;
  accountName: string;
  /** URL gambar QRIS hasil upload admin. */
  qrImage: string;
  /** Logo bank / e-wallet, opsional. */
  logo: string;
  /** Langkah cara bayar. Kosong = pakai langkah bawaan sesuai tipe. */
  instructions: string[];
  isActive: boolean;
  sortOrder: number;
}

/** Bentuk ringkas yang ditulis di `data/` — sisanya diisi default saat dibaca. */
export interface PaymentMethodSeed {
  id: string;
  name: string;
  color: string;
  code: string;
  type?: PaymentType;
  accountLabel?: string;
  accountNumber?: string;
  accountName?: string;
  qrImage?: string;
  logo?: string;
  instructions?: string[];
  isActive?: boolean;
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

export interface ContactSettings {
  email: string;
  /** Format internasional tanpa +, contoh 6281234567890. */
  whatsapp: string;
  /** Versi tampilan nomor, contoh "+62 812-3456-7890". */
  whatsappDisplay: string;
}

export interface SocialSettings {
  instagram: string;
  facebook: string;
  tiktok: string;
}

/** Bagian identitas yang boleh diubah dari dashboard. */
export interface EditableSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  contact: ContactSettings;
  social: SocialSettings;
}

/**
 * Identitas lengkap yang dipakai halaman: gabungan nilai yang bisa diedit admin
 * dengan nilai yang tetap berasal dari kode/env.
 */
export interface SiteSettings extends EditableSettings {
  /** Origin canonical — selalu dari NEXT_PUBLIC_SITE_URL, tidak diedit admin. */
  url: string;
  locale: string;
  lang: string;
}

/** Satu dokumen konten presentasi, seperti yang tersimpan di tabel `site_content`. */
export interface StoredContent {
  settings: EditableSettings;
  navigation: { header: NavItem[]; help: NavItem[] };
  heroSlides: HeroSlide[];
  faq: FaqItem[];
  testimonials: Testimonial[];
  promoCodes: PromoCode[];
}

/** Sama seperti StoredContent, tapi identitasnya sudah lengkap untuk dirender. */
export interface SiteContent extends Omit<StoredContent, "settings"> {
  settings: SiteSettings;
}

/** Bentuk kode promo di form admin — diskon dalam persen, bukan pecahan. */
export interface PromoDraft {
  code: string;
  /** Contoh 10 untuk diskon 10%. */
  percent: number;
}

export type OrderStatus = "menunggu" | "dibayar" | "selesai" | "batal";

/** Satu pesanan top up. Disimpan di tabel `orders`. */
export interface Order {
  id: string;
  invoice: string;
  gameSlug: string | null;
  gameName: string;
  itemLabel: string;
  diamonds: number | null;
  accountId: string;
  zoneId: string | null;
  contact: string | null;
  /** Nama metode saat pesanan dibuat — snapshot, aman walau metodenya diubah admin. */
  paymentMethod: string;
  /** Null kalau metodenya sudah dihapus admin. */
  paymentMethodId: string | null;
  subtotal: number;
  fee: number;
  discount: number;
  promoCode: string | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/** Satu langkah pada linimasa status pesanan. */
export interface OrderStep {
  label: string;
  time: string;
}

/** Hasil operasi simpan/ubah dari dashboard admin. */
export interface ActionResult {
  ok: boolean;
  message: string;
}

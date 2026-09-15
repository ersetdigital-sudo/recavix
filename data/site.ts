import type { NavItem } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://recavix.net";

export const site = {
  name: "Recavix",
  shortName: "Recavix",
  /** TODO(maintainer): konfirmasi domain produksi / set NEXT_PUBLIC_SITE_URL. */
  url: siteUrl,
  locale: "id_ID",
  lang: "id",
  tagline: "Top Up Game Termurah",
  description:
    "Recavix — top up diamond, gems, dan voucher game favoritmu. Proses otomatis 24 jam, harga termurah, pembayaran QRIS, e-wallet, dan transfer bank.",
  /** Contact + placeholders yang perlu diisi manual. */
  contact: {
    email: "halo@recavix.net",
    /** TODO(maintainer): ganti dengan nomor WhatsApp bisnis (format 62...). */
    whatsapp: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890",
  },
  social: {
    /** TODO(maintainer): isi URL sosial media asli. */
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Topup Game", href: "/topup" },
  { label: "Semua Game", href: "/games" },
  { label: "Cek Transaksi", href: "/cek-transaksi" },
];

export const helpLinks: NavItem[] = [
  // TODO(maintainer): arahkan ke halaman/panduan asli.
  { label: "Cara Top Up", href: "/#faq" },
  { label: "Syarat & Ketentuan", href: "/#faq" },
];

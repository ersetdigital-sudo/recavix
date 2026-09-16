import { faqItems } from "@/data/faq";
import { heroSlides } from "@/data/hero-slides";
import { promoCodes } from "@/data/payment-methods";
import { helpLinks, mainNav, site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import type { StoredContent } from "@/types";

/**
 * Nilai yang TIDAK bisa diedit dari dashboard: origin dan locale situs berasal
 * dari kode/env, bukan dari database. Dipisahkan supaya dokumen di database
 * hanya berisi hal-hal yang memang urusan admin.
 */
export const SITE_ORIGIN = site.url;
export const SITE_LOCALE = site.locale;
export const SITE_LANG = site.lang;

/**
 * Isi bawaan konten presentasi, dibaca langsung dari `data/`.
 *
 * Dipakai selama admin belum pernah menyimpan apa pun (baris masih kosong), dan
 * menjadi target tombol "kembalikan ke isi awal".
 */
export const DEFAULT_CONTENT: StoredContent = {
  settings: {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    description: site.description,
    contact: { ...site.contact },
    social: { ...site.social },
  },
  navigation: { header: mainNav, help: helpLinks },
  heroSlides,
  faq: faqItems,
  testimonials,
  promoCodes,
};

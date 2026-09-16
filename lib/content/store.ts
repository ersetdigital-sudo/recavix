import { unstable_cache } from "next/cache";

import { CONTENT_TAG } from "@/lib/cache";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type { EditableSettings, SiteContent, SiteSettings, StoredContent } from "@/types";

import { DEFAULT_CONTENT, SITE_LANG, SITE_LOCALE, SITE_ORIGIN } from "./defaults";

const TABLE = "site_content";
const ROW_ID = "main";

/**
 * Lengkapi dokumen yang tersimpan dengan nilai bawaan.
 *
 * Dokumen bisa saja tersimpan sebelum sebuah bagian ada (mis. admin menyimpan
 * slide sebelum bagian FAQ ditambahkan), jadi tiap bagian diperiksa sendiri —
 * bukan hanya dokumennya.
 */
function mergeDefaults(stored: StoredContent | null | undefined): StoredContent {
  if (!stored) return DEFAULT_CONTENT;

  return {
    settings: {
      ...DEFAULT_CONTENT.settings,
      ...stored.settings,
      contact: { ...DEFAULT_CONTENT.settings.contact, ...stored.settings?.contact },
      social: { ...DEFAULT_CONTENT.settings.social, ...stored.settings?.social },
    },
    navigation: {
      header: stored.navigation?.header ?? DEFAULT_CONTENT.navigation.header,
      help: stored.navigation?.help ?? DEFAULT_CONTENT.navigation.help,
    },
    heroSlides: stored.heroSlides ?? DEFAULT_CONTENT.heroSlides,
    faq: stored.faq ?? DEFAULT_CONTENT.faq,
    testimonials: stored.testimonials ?? DEFAULT_CONTENT.testimonials,
    promoCodes: stored.promoCodes ?? DEFAULT_CONTENT.promoCodes,
  };
}

function withRuntimeSettings(content: StoredContent): SiteContent {
  const settings: SiteSettings = {
    ...content.settings,
    url: SITE_ORIGIN,
    locale: SITE_LOCALE,
    lang: SITE_LANG,
  };
  return { ...content, settings };
}

/** Selalu baca sumber terbaru. Melempar error kalau penyimpanan bermasalah. */
export async function getStoredContent(): Promise<StoredContent> {
  if (!isSupabaseConfigured()) return DEFAULT_CONTENT;

  const response = await supabaseFetch(`${TABLE}?id=eq.${ROW_ID}&select=data`);
  const rows = (await response.json()) as { data?: StoredContent }[];
  return mergeDefaults(rows[0]?.data);
}

export interface ContentSnapshot {
  content: SiteContent;
  /** Diisi kalau backend gagal — ditampilkan di dashboard admin. */
  error: string | null;
}

/** Versi yang tidak melempar, untuk halaman admin. */
export async function getContentSnapshot(): Promise<ContentSnapshot> {
  try {
    return { content: withRuntimeSettings(await getStoredContent()), error: null };
  } catch (error) {
    console.error("[konten] gagal dibaca:", error);
    return {
      content: withRuntimeSettings(DEFAULT_CONTENT),
      error: "Konten gagal dimuat dari penyimpanan.",
    };
  }
}

/**
 * Versi ber-cache untuk halaman publik, di-invalidasi lewat
 * revalidateTag(CONTENT_TAG) setiap admin menyimpan.
 */
export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => withRuntimeSettings(await getStoredContent()),
  ["recavix-site-content"],
  { tags: [CONTENT_TAG] },
);

/**
 * Simpan dokumen konten.
 *
 * `url`, `locale`, dan `lang` dibuang sebelum ditulis: ketiganya berasal dari
 * kode/env, jadi menyimpannya ke database hanya akan membuat nilai basi yang
 * menyesatkan di kemudian hari.
 */
export async function writeContent(content: StoredContent): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Penyimpanan konten belum dikonfigurasi di server ini.");
  }

  // Field yang boleh disimpan ditulis satu per satu — bukan dengan membuang
  // `url`/`locale`/`lang` — supaya menambah field runtime baru tidak diam-diam
  // ikut tersimpan ke database.
  const settings: EditableSettings = {
    name: content.settings.name,
    shortName: content.settings.shortName,
    tagline: content.settings.tagline,
    description: content.settings.description,
    contact: content.settings.contact,
    social: content.settings.social,
  };

  await supabaseFetch(TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([
      { id: ROW_ID, data: { ...content, settings }, updated_at: new Date().toISOString() },
    ]),
  });
}

/** Hapus dokumen konten supaya kembali ke isi bawaan. */
export async function clearContent(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabaseFetch(`${TABLE}?id=eq.${ROW_ID}`, { method: "DELETE" });
}

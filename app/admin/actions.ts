"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { endSession, isAuthEnabled, isAuthorized, startSession } from "@/lib/admin/auth";
import { CONTENT_TAG } from "@/lib/cache";
import { writeGames, writePacks } from "@/lib/catalog/store";
import { GAME_CATEGORIES, GAME_PLATFORMS } from "@/data/games";
import { isPaymentMethodReady } from "@/lib/payments/shared";
import { writePaymentMethods } from "@/lib/payments/store";
import { clearContent, getStoredContent, writeContent } from "@/lib/content/store";
import { isOrderStatus } from "@/lib/orders/status";
import { updateOrderStatus } from "@/lib/orders/store";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type {
  ActionResult,
  CatalogGame,
  CatalogPack,
  FaqItem,
  GameCategory,
  GamePlatform,
  HeroSlide,
  NavItem,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  PromoCode,
  PromoDraft,
  StoredContent,
  Testimonial,
} from "@/types";

const UNAUTHORIZED: ActionResult = { ok: false, message: "Sesi tidak sah. Silakan login ulang." };

/** Tembak cache konten supaya halaman publik ikut membaca data terbaru. */
function refreshPublicPages() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => {
  const candidate = text(value);
  return (allowed as readonly string[]).includes(candidate) ? (candidate as T) : fallback;
};

/** Rapikan data game yang datang dari form supaya tabel tidak diisi nilai aneh. */
function normalizeGame(raw: unknown, index: number): CatalogGame | null {
  if (!isPlainObject(raw)) return null;

  const name = text(raw.name).trim();
  const slug = slugify(text(raw.slug).trim() || name);
  if (!slug || !name) return null;

  return {
    slug,
    name,
    category: oneOf<GameCategory>(raw.category, GAME_CATEGORIES, GAME_CATEGORIES[0]),
    platform: oneOf<GamePlatform>(raw.platform, GAME_PLATFORMS, GAME_PLATFORMS[0]),
    image: text(raw.image).trim(),
    rating: Math.min(5, Math.max(1, Math.round(num(raw.rating, 5)))),
    // Tidak diisi dianggap aktif, jadi game lama tetap tampil.
    isActive: raw.isActive !== false,
    sortOrder: index,
  };
}

function normalizePack(
  raw: unknown,
  index: number,
  usedIds: Set<string>,
  gameSlug: string,
): CatalogPack | null {
  if (!isPlainObject(raw)) return null;

  const diamonds = Math.round(num(raw.diamonds));
  if (!(diamonds > 0)) return null;

  const base = slugify(text(raw.id).trim()) || `pack-${diamonds}`;
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);

  const tag = text(raw.tag).trim();

  return {
    id,
    gameSlug,
    diamonds,
    price: Math.max(0, Math.round(num(raw.price))),
    tag: tag || undefined,
    isActive: raw.isActive !== false,
    sortOrder: index,
  };
}

function normalizePaymentMethod(
  raw: unknown,
  index: number,
  usedIds: Set<string>,
): PaymentMethod | null {
  if (!isPlainObject(raw)) return null;

  const name = text(raw.name).trim();
  if (!name) return null;

  const base = slugify(text(raw.id).trim()) || slugify(name) || `metode-${index + 1}`;
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);

  const type = oneOf<PaymentType>(raw.type, ["qris", "transfer"], "transfer");
  const instructions = Array.isArray(raw.instructions)
    ? raw.instructions
        .filter((step): step is string => typeof step === "string")
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  return {
    id,
    name,
    color: text(raw.color, "#4f7a4a").trim(),
    code: text(raw.code).trim().slice(0, 4),
    type,
    accountLabel: text(raw.accountLabel).trim() || (type === "qris" ? "QRIS" : "Nomor Tujuan"),
    accountNumber: text(raw.accountNumber).trim(),
    accountName: text(raw.accountName).trim(),
    qrImage: text(raw.qrImage).trim(),
    logo: text(raw.logo).trim(),
    instructions,
    isActive: raw.isActive !== false,
    sortOrder: index,
  };
}

/** Simpan seluruh katalog game. */
export async function saveGames(games: CatalogGame[]): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;
  if (!Array.isArray(games)) return { ok: false, message: "Data katalog tidak valid." };

  const normalized = games
    .map(normalizeGame)
    .filter((game): game is CatalogGame => game !== null);

  const skipped = games.length - normalized.length;

  const seen = new Set<string>();
  for (const game of normalized) {
    if (seen.has(game.slug)) {
      return { ok: false, message: `Slug "${game.slug}" dipakai lebih dari satu game.` };
    }
    seen.add(game.slug);
  }

  try {
    await writeGames(normalized);
    refreshPublicPages();
    revalidatePath("/admin/katalog");
    return {
      ok: true,
      message:
        skipped > 0
          ? `Katalog game tersimpan. ${skipped} baris dilewati karena nama atau slug-nya kosong.`
          : "Katalog game tersimpan.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan katalog game.",
    };
  }
}

/** Simpan seluruh daftar paket diamond. */
export async function savePacks(gameSlug: string, packs: CatalogPack[]): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;

  const slug = slugify(text(gameSlug));
  if (!slug) return { ok: false, message: "Game tidak valid." };
  if (!Array.isArray(packs)) return { ok: false, message: "Data paket tidak valid." };

  const usedIds = new Set<string>();
  const normalized = packs
    .map((pack, index) => normalizePack(pack, index, usedIds, slug))
    .filter((pack): pack is CatalogPack => pack !== null);

  const skipped = packs.length - normalized.length;

  if (normalized.length === 0) {
    return { ok: false, message: "Minimal harus ada satu paket diamond." };
  }

  try {
    await writePacks(slug, normalized);
    refreshPublicPages();
    revalidatePath("/admin/paket");
    return {
      ok: true,
      message:
        skipped > 0
          ? `Paket diamond tersimpan. ${skipped} baris dilewati karena jumlah diamond harus lebih dari 0.`
          : "Paket diamond tersimpan.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan paket diamond.",
    };
  }
}

/** Simpan seluruh daftar metode pembayaran. */
export async function savePaymentMethods(methods: PaymentMethod[]): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;
  if (!Array.isArray(methods)) {
    return { ok: false, message: "Data metode pembayaran tidak valid." };
  }

  const usedIds = new Set<string>();
  const normalized = methods
    .map((method, index) => normalizePaymentMethod(method, index, usedIds))
    .filter((method): method is PaymentMethod => method !== null);

  const skipped = methods.length - normalized.length;

  // Metode aktif yang datanya belum lengkap tidak diblokir, tapi dinonaktifkan
  // otomatis — supaya tidak ada metode setengah jadi yang tampil ke pembeli,
  // dan admin tetap bisa menyimpan progres tanpa mengisi semuanya dulu.
  const autoDisabled: string[] = [];
  const prepared = normalized.map((method) => {
    if (method.isActive && !isPaymentMethodReady(method)) {
      autoDisabled.push(method.name);
      return { ...method, isActive: false };
    }
    return method;
  });

  try {
    await writePaymentMethods(prepared);
    refreshPublicPages();
    revalidatePath("/admin/pembayaran");

    if (autoDisabled.length > 0) {
      return {
        ok: true,
        message: `${skipped > 0 ? `${skipped} baris dilewati karena namanya kosong. ` : ""}Tersimpan. Dinonaktifkan otomatis karena datanya belum lengkap: ${autoDisabled.join(", ")}.`,
      };
    }
    return {
      ok: true,
      message:
        skipped > 0
          ? `Metode pembayaran tersimpan. ${skipped} baris dilewati karena namanya kosong.`
          : "Metode pembayaran tersimpan.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan metode pembayaran.",
    };
  }
}

/** Ubah status pesanan dari dashboard. */
export async function setOrderStatus(id: string, status: string): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;
  if (!isOrderStatus(status)) return { ok: false, message: "Status tidak dikenal." };

  try {
    await updateOrderStatus(id, status as OrderStatus);
    revalidatePath("/admin/pesanan");
    revalidatePath("/admin");
    return { ok: true, message: "Status diperbarui." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui status.",
    };
  }
}

const normalizeNav = (raw: unknown): NavItem[] =>
  Array.isArray(raw)
    ? raw
        .filter((item): item is Record<string, unknown> => isPlainObject(item))
        .map((item) => ({ label: text(item.label).trim(), href: text(item.href).trim() }))
        .filter((item) => item.label.length > 0 && item.href.length > 0)
    : [];

const normalizeHeroSlides = (raw: unknown): HeroSlide[] => {
  if (!Array.isArray(raw)) return [];

  const usedIds = new Set<string>();
  const slides: HeroSlide[] = [];

  raw
    .filter((item): item is Record<string, unknown> => isPlainObject(item))
    .forEach((item, index) => {
      const image = text(item.image).trim();
      if (!image) return;

      const base = slugify(text(item.id).trim()) || `slide-${index + 1}`;
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);

      slides.push({
        id,
        image,
        alt: text(item.alt).trim(),
        href: text(item.href).trim() || "/topup",
      });
    });

  return slides;
};

const normalizeFaq = (raw: unknown): FaqItem[] =>
  Array.isArray(raw)
    ? raw
        .filter((item): item is Record<string, unknown> => isPlainObject(item))
        .map((item) => ({
          question: text(item.question).trim(),
          answer: text(item.answer).trim(),
        }))
        .filter((item) => item.question.length > 0 && item.answer.length > 0)
    : [];

const normalizeTestimonials = (raw: unknown): Testimonial[] =>
  Array.isArray(raw)
    ? raw
        .filter((item): item is Record<string, unknown> => isPlainObject(item))
        .map((item) => ({
          name: text(item.name).trim(),
          role: text(item.role).trim(),
          quote: text(item.quote).trim(),
          rating: Math.min(5, Math.max(1, Math.round(num(item.rating, 5)))),
        }))
        .filter((item) => item.name.length > 0 && item.quote.length > 0)
    : [];

/** Form mengirim diskon dalam persen; dokumen menyimpannya sebagai pecahan. */
const normalizePromos = (raw: unknown): PromoCode[] => {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const promos: PromoCode[] = [];

  raw
    .filter((item): item is Record<string, unknown> => isPlainObject(item))
    .forEach((item) => {
      const code = text(item.code).trim().toUpperCase();
      if (!code || seen.has(code)) return;
      seen.add(code);

      const percent = Math.min(100, Math.max(0, num(item.percent)));
      promos.push({ code, discount: Math.round(percent) / 100 });
    });

  return promos;
};

/** Simpan satu bagian dokumen konten, sisanya dibiarkan apa adanya. */
async function saveSection(
  mutate: (current: StoredContent) => StoredContent,
  adminPath: string,
): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;

  try {
    const current = await getStoredContent();
    await writeContent(mutate(current));
    refreshPublicPages();
    revalidatePath(adminPath);
    return { ok: true, message: "Perubahan tersimpan." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan perubahan.",
    };
  }
}

/**
 * Identitas brand.
 *
 * Tiap bagian identitas punya action sendiri yang MENGGABUNG ke nilai yang ada,
 * bukan menggantinya: form identitas hanya mengirim fieldnya sendiri, jadi kalau
 * action-nya mengganti seluruh objek settings, kontak dan media sosial akan
 * ikut terhapus.
 */
export async function saveIdentity(patch: {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
}): Promise<ActionResult> {
  const name = text(patch?.name).trim() || "Recavix";
  const shortName = text(patch?.shortName).trim() || name;

  return saveSection(
    (current) => ({
      ...current,
      settings: {
        ...current.settings,
        name,
        shortName,
        tagline: text(patch?.tagline).trim(),
        description: text(patch?.description).trim(),
      },
    }),
    "/admin/identitas",
  );
}

/** Kontak CS. */
export async function saveContact(patch: {
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
}): Promise<ActionResult> {
  return saveSection(
    (current) => ({
      ...current,
      settings: {
        ...current.settings,
        contact: {
          email: text(patch?.email).trim(),
          // Nomor ini disisipkan ke dalam URL wa.me — hanya digit yang boleh lolos.
          whatsapp: text(patch?.whatsapp).replace(/[^0-9]/g, ""),
          whatsappDisplay: text(patch?.whatsappDisplay).trim(),
        },
      },
    }),
    "/admin/identitas",
  );
}

/** Media sosial. */
export async function saveSocial(patch: {
  instagram: string;
  facebook: string;
  tiktok: string;
}): Promise<ActionResult> {
  return saveSection(
    (current) => ({
      ...current,
      settings: {
        ...current.settings,
        social: {
          instagram: text(patch?.instagram).trim(),
          facebook: text(patch?.facebook).trim(),
          tiktok: text(patch?.tiktok).trim(),
        },
      },
    }),
    "/admin/identitas",
  );
}

/**
 * Menu header.
 *
 * Terpisah dari menu footer — bukan satu action dengan parameter objek — karena
 * server action tidak bisa dibungkus closure saat dikirim ke client component,
 * jadi tiap daftar butuh action-nya sendiri.
 */
export async function saveHeaderNav(items: NavItem[]): Promise<ActionResult> {
  const header = normalizeNav(items);

  if (header.length === 0) {
    return { ok: false, message: "Menu header minimal harus punya satu tautan." };
  }

  return saveSection(
    (current) => ({ ...current, navigation: { ...current.navigation, header } }),
    "/admin/identitas",
  );
}

/** Menu bantuan di footer. */
export async function saveHelpNav(items: NavItem[]): Promise<ActionResult> {
  const help = normalizeNav(items);

  return saveSection(
    (current) => ({ ...current, navigation: { ...current.navigation, help } }),
    "/admin/identitas",
  );
}

/** Slide banner di beranda. */
export async function saveHeroSlides(slides: HeroSlide[]): Promise<ActionResult> {
  const normalized = normalizeHeroSlides(slides);
  return saveSection((current) => ({ ...current, heroSlides: normalized }), "/admin/banner");
}

/** Pertanyaan umum — dipakai accordion di beranda sekaligus JSON-LD FAQPage. */
export async function saveFaq(items: FaqItem[]): Promise<ActionResult> {
  const normalized = normalizeFaq(items);
  return saveSection((current) => ({ ...current, faq: normalized }), "/admin/ulasan");
}

/** Ulasan pelanggan di beranda. */
export async function saveTestimonials(items: Testimonial[]): Promise<ActionResult> {
  const normalized = normalizeTestimonials(items);
  return saveSection((current) => ({ ...current, testimonials: normalized }), "/admin/ulasan");
}

/** Kode promo — dipakai checkout untuk menghitung diskon. */
export async function savePromoCodes(codes: PromoDraft[]): Promise<ActionResult> {
  const normalized = normalizePromos(codes);
  return saveSection((current) => ({ ...current, promoCodes: normalized }), "/admin/promo");
}

/** Kembalikan katalog ke isi awal (hapus baris, lalu pakai default dari `data/`). */
export async function resetContent(): Promise<ActionResult> {
  if (!(await isAuthorized())) return UNAUTHORIZED;
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Penyimpanan belum dikonfigurasi di server ini." };
  }

  try {
    await Promise.all([
      supabaseFetch("games?select=slug", { method: "DELETE" }),
      supabaseFetch("diamond_packs?select=id", { method: "DELETE" }),
      supabaseFetch("payment_methods?select=id", { method: "DELETE" }),
      clearContent(),
    ]);
    refreshPublicPages();
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Katalog dan konten dikembalikan ke isi awal." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Tidak bisa mengembalikan isi awal.",
    };
  }
}

export async function loginAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAuthEnabled()) {
    return { ok: false, message: "ADMIN_PASSWORD belum di-set di server ini." };
  }

  const password = String(formData.get("password") ?? "");
  const success = await startSession(password);
  if (!success) return { ok: false, message: "Password salah." };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

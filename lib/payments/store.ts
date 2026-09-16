import { unstable_cache } from "next/cache";

import { CACHE_EPOCH, CONTENT_TAG } from "@/lib/cache";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type { PaymentMethod } from "@/types";

import { DEFAULT_PAYMENT_METHODS } from "./defaults";

const TABLE = "payment_methods";

interface PaymentRow {
  id: string;
  name: string;
  color: string;
  code: string;
  type: string;
  account_label: string;
  account_number: string | null;
  account_name: string | null;
  qr_image: string | null;
  logo: string | null;
  instructions: string[] | null;
  is_active: boolean;
  sort_order: number;
}

const toMethod = (row: PaymentRow): PaymentMethod => ({
  id: row.id,
  name: row.name,
  color: row.color ?? "",
  code: row.code ?? "",
  type: row.type === "qris" ? "qris" : "transfer",
  accountLabel: row.account_label ?? "Nomor Tujuan",
  accountNumber: row.account_number ?? "",
  accountName: row.account_name ?? "",
  qrImage: row.qr_image ?? "",
  logo: row.logo ?? "",
  instructions: Array.isArray(row.instructions) ? row.instructions : [],
  isActive: row.is_active !== false,
  sortOrder: row.sort_order ?? 0,
});

const toRow = (method: PaymentMethod, index: number) => ({
  id: method.id,
  name: method.name,
  color: method.color,
  code: method.code,
  type: method.type,
  account_label: method.accountLabel,
  account_number: method.accountNumber || null,
  account_name: method.accountName || null,
  qr_image: method.qrImage || null,
  logo: method.logo || null,
  instructions: method.instructions,
  is_active: method.isActive,
  sort_order: index,
  updated_at: new Date().toISOString(),
});

export interface PaymentSnapshot {
  methods: PaymentMethod[];
  error: string | null;
}

/** Semua metode, termasuk yang nonaktif — untuk dashboard admin. */
export async function getPaymentSnapshot(): Promise<PaymentSnapshot> {
  if (!isSupabaseConfigured()) {
    return { methods: DEFAULT_PAYMENT_METHODS, error: null };
  }

  try {
    const response = await supabaseFetch(`${TABLE}?select=*&order=sort_order.asc`);
    const rows = (await response.json()) as PaymentRow[];

    return {
      methods: rows.length > 0 ? rows.map(toMethod) : DEFAULT_PAYMENT_METHODS,
      error: null,
    };
  } catch (error) {
    console.error("[pembayaran] gagal dibaca:", error);
    return {
      methods: DEFAULT_PAYMENT_METHODS,
      error: "Metode pembayaran gagal dimuat dari penyimpanan.",
    };
  }
}

/**
 * Hanya metode aktif, versi ber-cache untuk halaman publik.
 *
 * Tanpa pembungkus ini, fetch `no-store` di dalamnya terbaca Next sebagai
 * dynamic usage saat build: halaman tetap jadi, tapi isinya jatuh ke data
 * cadangan, bukan metode yang ada di database.
 */
export const getCachedPaymentMethods = unstable_cache(
  async () => {
    const { methods } = await getPaymentSnapshot();
    return methods.filter((method) => method.isActive);
  },
  ["recavix-payment-methods", CACHE_EPOCH],
  { tags: [CONTENT_TAG] },
);

/** Cari satu metode berdasarkan id, termasuk yang sudah nonaktif. */
export async function findPaymentMethod(id: string | null): Promise<PaymentMethod | null> {
  if (!id) return null;
  const { methods } = await getPaymentSnapshot();
  return methods.find((method) => method.id === id) ?? null;
}

export async function writePaymentMethods(methods: PaymentMethod[]): Promise<void> {
  const rows = methods.map(toRow);

  if (rows.length > 0) {
    await supabaseFetch(TABLE, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
  }

  const keep = methods.map((method) => method.id);
  const notIn = keep.length > 0 ? `&id=not.in.(${keep.join(",")})` : "";
  await supabaseFetch(`${TABLE}?select=id${notIn}`, { method: "DELETE" });
}

export { PAYMENT_TYPE_LABEL, isPaymentMethodReady } from "./shared";

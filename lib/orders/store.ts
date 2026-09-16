import { SupabaseError, isSupabaseConfigured, supabaseFetch } from "@/lib/supabase/config";
import type { Order, OrderStatus } from "@/types";

import { isOrderStatus } from "./status";

const TABLE = "orders";

interface OrderRow {
  id: string;
  invoice: string;
  game_slug: string | null;
  game_name: string;
  item_label: string;
  diamonds: number | null;
  account_id: string;
  zone_id: string | null;
  contact: string | null;
  payment_method: string;
  payment_method_id: string | null;
  subtotal: number;
  fee: number;
  discount: number;
  promo_code: string | null;
  total: number;
  status: string;
  created_at: string;
}

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  invoice: row.invoice,
  gameSlug: row.game_slug,
  gameName: row.game_name,
  itemLabel: row.item_label,
  diamonds: row.diamonds,
  accountId: row.account_id,
  zoneId: row.zone_id,
  contact: row.contact,
  paymentMethod: row.payment_method,
  paymentMethodId: row.payment_method_id,
  subtotal: row.subtotal,
  fee: row.fee,
  discount: row.discount,
  promoCode: row.promo_code,
  total: row.total,
  // Status tak dikenal diperlakukan sebagai belum dibayar, bukan disembunyikan.
  status: isOrderStatus(row.status) ? row.status : "menunggu",
  createdAt: row.created_at,
});

export interface NewOrder {
  gameSlug: string | null;
  gameName: string;
  itemLabel: string;
  diamonds: number | null;
  accountId: string;
  zoneId: string | null;
  contact: string | null;
  paymentMethod: string;
  paymentMethodId: string | null;
  subtotal: number;
  fee: number;
  discount: number;
  promoCode: string | null;
  total: number;
}

/** RCV-YYMMDD-XXXX */
function buildInvoice(now = new Date()) {
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `RCV-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function requireStorage() {
  if (!isSupabaseConfigured()) {
    throw new Error("Penyimpanan pesanan belum dikonfigurasi di server ini.");
  }
}

/**
 * Simpan pesanan baru. Nomor invoice dibuat di sini, bukan diambil dari klien.
 *
 * Constraint unique pada kolom invoice jadi penjaga terakhir kalau nomornya
 * bentrok, jadi percobaan diulang dengan nomor lain.
 */
export async function createOrder(input: NewOrder): Promise<Order> {
  requireStorage();

  for (let attempt = 0; attempt < 5; attempt++) {
    const invoice = buildInvoice();

    try {
      const response = await supabaseFetch(TABLE, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify([
          {
            invoice,
            game_slug: input.gameSlug,
            game_name: input.gameName,
            item_label: input.itemLabel,
            diamonds: input.diamonds,
            account_id: input.accountId,
            zone_id: input.zoneId,
            contact: input.contact,
            payment_method: input.paymentMethod,
            payment_method_id: input.paymentMethodId,
            subtotal: input.subtotal,
            fee: input.fee,
            discount: input.discount,
            promo_code: input.promoCode,
            total: input.total,
          },
        ]),
      });

      const rows = (await response.json()) as OrderRow[];
      const row = rows[0];
      if (row) return toOrder(row);
    } catch (error) {
      // 409 = invoice sudah dipakai, coba nomor lain.
      if (error instanceof SupabaseError && error.status === 409) continue;
      throw error;
    }
  }

  throw new Error("Gagal membuat nomor invoice unik. Coba lagi.");
}

export interface OrdersSnapshot {
  orders: Order[];
  error: string | null;
}

/** Daftar pesanan terbaru, opsional disaring per status. */
export async function getOrdersSnapshot(
  options: { status?: OrderStatus; limit?: number } = {},
): Promise<OrdersSnapshot> {
  if (!isSupabaseConfigured()) {
    return { orders: [], error: "Penyimpanan pesanan belum dikonfigurasi di server ini." };
  }

  const limit = options.limit ?? 100;
  const filter = options.status ? `&status=eq.${options.status}` : "";

  try {
    const response = await supabaseFetch(
      `${TABLE}?select=*&order=created_at.desc&limit=${limit}${filter}`,
    );
    const rows = (await response.json()) as OrderRow[];
    return { orders: rows.map(toOrder), error: null };
  } catch (error) {
    console.error("[pesanan] gagal dibaca:", error);
    return { orders: [], error: "Pesanan gagal dimuat dari penyimpanan." };
  }
}

export interface OrderStats {
  total: number;
  menunggu: number;
  dibayar: number;
  selesai: number;
  batal: number;
  /** Dihitung dari pesanan yang sudah ditandai bayar atau selesai. */
  revenue: number;
}

const EMPTY_STATS: OrderStats = {
  total: 0,
  menunggu: 0,
  dibayar: 0,
  selesai: 0,
  batal: 0,
  revenue: 0,
};

/**
 * Ringkasan pesanan.
 *
 * Sengaja mengambil hanya dua kolom tanpa batas baris: menghitung dari daftar
 * yang dibatasi limit membuat total pendapatan diam-diam salah begitu pesanan
 * lewat batas itu.
 */
export async function getOrderStats(): Promise<{ stats: OrderStats; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { stats: EMPTY_STATS, error: "Penyimpanan pesanan belum dikonfigurasi di server ini." };
  }

  try {
    const response = await supabaseFetch(`${TABLE}?select=status,total`);
    const rows = (await response.json()) as { status: string; total: number }[];

    const stats: OrderStats = { ...EMPTY_STATS, total: rows.length };

    for (const row of rows) {
      const status = isOrderStatus(row.status) ? row.status : "menunggu";
      stats[status] += 1;
      if (status === "dibayar" || status === "selesai") {
        stats.revenue += Number(row.total) || 0;
      }
    }

    return { stats, error: null };
  } catch (error) {
    console.error("[pesanan] gagal dihitung:", error);
    return { stats: EMPTY_STATS, error: "Ringkasan pesanan gagal dimuat." };
  }
}

/** Dipakai halaman pembayaran dan pelacak transaksi. */
export async function findOrderByInvoice(invoice: string): Promise<Order | null> {
  requireStorage();

  const response = await supabaseFetch(
    `${TABLE}?select=*&invoice=eq.${encodeURIComponent(invoice)}&limit=1`,
  );
  const rows = (await response.json()) as OrderRow[];
  return rows[0] ? toOrder(rows[0]) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  requireStorage();

  await supabaseFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
}

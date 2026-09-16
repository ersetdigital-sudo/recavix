"use server";

import { revalidatePath } from "next/cache";

import { readActiveGames, readActivePacks } from "@/lib/catalog/store";
import { getStoredContent } from "@/lib/content/store";
import { getPaymentSnapshot } from "@/lib/payments/store";
import { calculatePricing, findDiscountRate } from "@/lib/pricing";
import type { ActionResult } from "@/types";

import { createOrder, findOrderByInvoice, updateOrderStatus } from "./store";

export interface CheckoutInput {
  gameSlug: string;
  /** Id paket, bukan harga — harga dicari server dari database. */
  packId: string;
  accountId: string;
  zoneId: string;
  contact: string;
  paymentMethodId: string;
  /** Kode promo yang dipakai pembeli. Kosong berarti tanpa diskon. */
  promoCode: string;
}

export type CheckoutResult =
  | { ok: true; invoice: string; total: number }
  | { ok: false; message: string };

/**
 * Membuat pesanan dari pilihan pembeli.
 *
 * HARGA DAN NAMA METODE TIDAK DIKIRIM DARI BROWSER. Yang dikirim hanya slug
 * game, id paket, dan id metode — sisanya dicari ulang di server. Jadi angka di
 * halaman tidak bisa dimanipulasi lewat request.
 */
export async function createCheckoutOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const accountId = input.accountId.trim();
  if (!accountId) return { ok: false, message: "User ID wajib diisi." };

  try {
    const [games, payments, content] = await Promise.all([
      readActiveGames(),
      getPaymentSnapshot(),
      getStoredContent(),
    ]);

    // Katalog aktif saja: game atau paket yang dinonaktifkan admin tidak bisa
    // dipesan, meski halamannya masih terbuka di browser pembeli.
    const game = games.find((entry) => entry.slug === input.gameSlug);
    if (!game) return { ok: false, message: "Game tidak ditemukan atau sudah tidak aktif." };
    if (game.comingSoon) {
      return { ok: false, message: "Game ini belum dibuka. Nantikan ya." };
    }

    // Harga dicari dari daftar paket milik game itu sendiri, bukan game lain.
    const pack = (await readActivePacks(game.slug)).find((entry) => entry.id === input.packId);
    if (!pack) return { ok: false, message: "Nominal tidak ditemukan. Pilih ulang." };

    const payment = payments.methods.find(
      (method) => method.id === input.paymentMethodId && method.isActive,
    );
    if (!payment) {
      return { ok: false, message: "Metode pembayaran tidak tersedia. Pilih metode lain." };
    }

    const rate = findDiscountRate(input.promoCode, content.promoCodes);
    if (rate === null) return { ok: false, message: "Kode promo tidak valid." };

    const pricing = calculatePricing(pack.price, rate);
    const submittedCode = input.promoCode.trim();

    const order = await createOrder({
      gameSlug: game.slug,
      gameName: game.name,
      itemLabel: `${pack.diamonds} Diamond`,
      diamonds: pack.diamonds,
      accountId,
      zoneId: input.zoneId.trim() || null,
      contact: input.contact.trim() || null,
      paymentMethod: payment.name,
      paymentMethodId: payment.id,
      promoCode: submittedCode ? submittedCode.toUpperCase() : null,
      ...pricing,
    });

    revalidatePath("/admin/pesanan");
    return { ok: true, invoice: order.invoice, total: order.total };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal membuat pesanan.",
    };
  }
}

/**
 * Pembeli menandai "sudah bayar". Ini klaim, bukan verifikasi — status akhirnya
 * tetap ditentukan admin setelah mengecek mutasi.
 *
 * Perubahannya dibatasi: hanya boleh dari "menunggu" ke "dibayar", supaya
 * halaman publik tidak bisa dipakai mengubah pesanan yang sudah diproses.
 */
export async function markOrderPaid(invoice: string): Promise<ActionResult> {
  try {
    const order = await findOrderByInvoice(invoice.trim());
    if (!order) return { ok: false, message: "Pesanan tidak ditemukan." };

    if (order.status === "dibayar" || order.status === "selesai") {
      return { ok: true, message: "Pesanan sudah ditandai dibayar." };
    }
    if (order.status !== "menunggu") {
      return { ok: false, message: "Pesanan ini sudah tidak aktif." };
    }

    await updateOrderStatus(order.id, "dibayar");
    revalidatePath("/admin/pesanan");
    revalidatePath(`/pembayaran/${order.invoice}`);
    return { ok: true, message: "Terima kasih! Mohon tunggu verifikasi admin." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui pesanan.",
    };
  }
}

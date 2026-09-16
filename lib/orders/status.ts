import type { OrderStatus } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = ["menunggu", "dibayar", "selesai", "batal"];

export const isOrderStatus = (value: string): value is OrderStatus =>
  (ORDER_STATUSES as string[]).includes(value);

/** Label versi admin. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu pembayaran",
  dibayar: "Sudah dibayar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  menunggu: "border-[#e8c98f] bg-[#fdeccb] text-[#96692a]",
  dibayar: "border-green bg-mint text-green-dd",
  selesai: "border-[#b6d6ae] bg-[#dff0d8] text-[#3f6a3b]",
  batal: "border-line bg-peach-2 text-coral-dark",
};

/**
 * Label versi pembeli. Status "dibayar" berarti pembeli sudah menandai bayar
 * dan pesanannya menunggu diverifikasi — dari sisi pembeli itu "Sedang
 * Diproses", bukan "Sudah dibayar".
 */
export const ORDER_STATUS_CUSTOMER_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu Pembayaran",
  dibayar: "Sedang Diproses",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const ORDER_STATUS_CUSTOMER_ICON: Record<OrderStatus, string> = {
  menunggu: "⏳",
  dibayar: "🔄",
  selesai: "✅",
  batal: "⚠️",
};

/** Berapa langkah linimasa yang sudah selesai untuk tiap status. */
const ORDER_TIMELINE_DONE: Record<OrderStatus, number> = {
  menunggu: 1,
  dibayar: 2,
  selesai: 4,
  batal: 2,
};

/**
 * Linimasa pesanan.
 *
 * Waktu hanya diisi untuk kejadian yang benar-benar kita catat — yaitu saat
 * pesanan dibuat. Sisanya ditampilkan tanpa waktu, bukan dengan waktu karangan:
 * menampilkan jam yang tidak pernah terjadi lebih buruk daripada tidak
 * menampilkan apa-apa.
 */
export function buildOrderTimeline(status: OrderStatus, createdAt: Date) {
  const created = createdAt.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const labels =
    status === "batal"
      ? ["Pesanan dibuat", "Pesanan dibatalkan", "—", "—"]
      : [
          "Pesanan dibuat",
          "Pembayaran dikonfirmasi",
          "Diproses ke server game",
          "Diamond masuk ke akun",
        ];

  const steps = labels
    .map((label, index) => ({ label, time: index === 0 ? created : "" }))
    .filter((step) => step.label !== "—");

  return { steps, done: Math.min(ORDER_TIMELINE_DONE[status], steps.length) };
}

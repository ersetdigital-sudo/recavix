export interface Pricing {
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
}

/**
 * Harga selalu dihitung di server.
 *
 * Browser tidak pernah mengirim angka harga — yang dikirim hanya id paket dan
 * kode promo, lalu harga aslinya dicari di database. Jadi mengubah nilai di
 * halaman tidak berpengaruh apa pun.
 */
export function calculatePricing(basePrice: number, discountRate = 0): Pricing {
  const subtotal = Math.max(0, Math.round(basePrice));
  const rate = Number.isFinite(discountRate) ? Math.min(Math.max(discountRate, 0), 1) : 0;
  const discount = Math.round(subtotal * rate);
  const fee = 0;

  return {
    subtotal,
    fee,
    discount,
    total: Math.max(0, subtotal - discount + fee),
  };
}

/** Cari tarif diskon dari daftar kode promo. Mengembalikan null kalau tidak ada. */
export function findDiscountRate(
  code: string,
  promos: { code: string; discount: number }[],
): number | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return 0;
  const found = promos.find((promo) => promo.code.toUpperCase() === normalized);
  return found ? found.discount : null;
}

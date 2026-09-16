import type { PaymentMethod, PaymentType } from "@/types";

/**
 * Helper murni tanpa akses server, supaya aman diimpor dari client component.
 * Modul store-nya menyentuh Supabase, jadi tidak boleh ikut ke bundle browser.
 */
export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  qris: "QRIS / Scan QR",
  transfer: "Transfer Bank / E-Wallet",
};

/** Metode dianggap siap dipakai kalau data wajibnya sudah diisi admin. */
export function isPaymentMethodReady(method: PaymentMethod) {
  return method.type === "qris"
    ? method.qrImage.trim().length > 0
    : method.accountNumber.trim().length > 0;
}

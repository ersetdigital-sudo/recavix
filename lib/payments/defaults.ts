import { paymentMethods } from "@/data/payment-methods";
import type { PaymentMethod } from "@/types";

/**
 * Isi bawaan metode pembayaran. `data/payment-methods.ts` sengaja ditulis
 * ringkas, jadi field yang tidak disebut di sana diisi di sini.
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = paymentMethods.map(
  (seed, index) => {
    const isQris = seed.id === "qris";

    return {
      id: seed.id,
      name: seed.name,
      color: seed.color,
      code: seed.code,
      type: seed.type ?? (isQris ? "qris" : "transfer"),
      accountLabel: seed.accountLabel ?? (isQris ? "QRIS" : "Nomor Tujuan"),
      accountNumber: seed.accountNumber ?? "",
      accountName: seed.accountName ?? "",
      qrImage: seed.qrImage ?? "",
      logo: seed.logo ?? "",
      instructions: seed.instructions ?? [],
      isActive: seed.isActive ?? true,
      sortOrder: index,
    };
  },
);

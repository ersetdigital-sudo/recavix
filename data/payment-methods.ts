import type { PaymentMethodSeed, PromoCode } from "@/types";

export const paymentMethods: PaymentMethodSeed[] = [
  { id: "qris", name: "QRIS (Semua e-wallet)", color: "#4f7a4a", code: "QR" },
  { id: "gopay", name: "GoPay", color: "#00a2e8", code: "GP" },
  { id: "dana", name: "DANA", color: "#1a8fe3", code: "DN" },
  { id: "ovo", name: "OVO", color: "#6b2fa0", code: "OVO" },
  { id: "shopeepay", name: "ShopeePay", color: "#ee4d2d", code: "SP" },
  { id: "bca", name: "Transfer Bank BCA", color: "#0a4b8c", code: "BCA" },
];

export const promoCodes: PromoCode[] = [
  { code: "GEMS10", discount: 0.1 },
  { code: "NEWBIE5", discount: 0.05 },
];

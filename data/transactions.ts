import type { Transaction, TransactionStatus } from "@/types";

/**
 * Demo dataset for the transaction tracker.
 * TODO(maintainer): replace with a real lookup against your order backend.
 */
export const transactions: Record<string, Transaction> = {
  "TG-2026-0001": {
    id: "TG-2026-0001",
    status: "success",
    game: "Mobile Legends",
    item: "344 Diamond",
    account: "123456789 (1234)",
    payment: "QRIS",
    total: "Rp 86.000",
    date: "13 Sep 2026, 14:02",
    steps: [
      { label: "Pesanan dibuat", time: "13 Sep 14:02" },
      { label: "Pembayaran diterima", time: "13 Sep 14:04" },
      { label: "Diproses ke server game", time: "13 Sep 14:05" },
      { label: "Diamond masuk ke akun", time: "13 Sep 14:05" },
    ],
    done: 4,
  },
  "TG-2026-0002": {
    id: "TG-2026-0002",
    status: "pending",
    game: "Free Fire",
    item: "720 Diamond",
    account: "998877665",
    payment: "Transfer Bank BCA",
    total: "Rp 99.000",
    date: "13 Sep 2026, 15:20",
    steps: [
      { label: "Pesanan dibuat", time: "13 Sep 15:20" },
      { label: "Menunggu pembayaran", time: "—" },
      { label: "Diproses ke server game", time: "—" },
      { label: "Diamond masuk ke akun", time: "—" },
    ],
    done: 1,
  },
  "TG-2026-0003": {
    id: "TG-2026-0003",
    status: "failed",
    game: "Honor of Kings",
    item: "86 Diamond",
    account: "552210987",
    payment: "ShopeePay",
    total: "Rp 22.000",
    date: "12 Sep 2026, 09:41",
    steps: [
      { label: "Pesanan dibuat", time: "12 Sep 09:41" },
      { label: "Pembayaran diterima", time: "12 Sep 09:43" },
      { label: "Gagal: User ID tidak ditemukan", time: "12 Sep 09:44" },
      { label: "Dana dikembalikan", time: "12 Sep 10:10" },
    ],
    done: 4,
  },
};

export const demoInvoiceIds = Object.keys(transactions);

export const statusMeta: Record<
  TransactionStatus,
  { badgeClass: string; label: string; icon: string }
> = {
  success: {
    badgeClass: "bg-[#dff0d8] text-[#3f6a3b]",
    label: "Berhasil",
    icon: "✅",
  },
  pending: {
    badgeClass: "bg-[#fdeccb] text-[#96692a]",
    label: "Menunggu Pembayaran",
    icon: "⏳",
  },
  failed: {
    badgeClass: "bg-[#fadfd8] text-[#a8402c]",
    label: "Gagal / Refund",
    icon: "⚠️",
  },
};

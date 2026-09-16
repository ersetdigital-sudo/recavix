import Image from "next/image";

import { CopyButton } from "@/components/order/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PaymentMethod } from "@/types";

const DEFAULT_QRIS_STEPS = [
  "Buka aplikasi e-wallet atau m-banking yang mendukung QRIS.",
  "Pindai gambar QR di atas.",
  "Masukkan nominal persis sesuai total di ringkasan.",
  "Simpan bukti pembayaran, lalu tekan “Saya Sudah Bayar”.",
];

const DEFAULT_TRANSFER_STEPS = [
  "Buka aplikasi m-banking atau e-wallet kamu.",
  "Transfer ke nomor tujuan di atas sejumlah total di ringkasan.",
  "Simpan bukti transfer, lalu tekan “Saya Sudah Bayar”.",
];

export function PaymentInstructions({ method }: { method: PaymentMethod | null }) {
  if (!method) {
    return (
      <SectionCard className="mb-5">
        <h2 className="text-[19px] font-extrabold">Cara Pembayaran</h2>
        <p className="mt-2 text-sm opacity-75">
          Detail metode pembayaran untuk pesanan ini sudah tidak tersedia — kemungkinan
          metodenya dihapus admin setelah pesanan dibuat. Hubungi CS kami dengan menyebut
          nomor invoice di atas.
        </p>
      </SectionCard>
    );
  }

  const steps =
    method.instructions.length > 0
      ? method.instructions
      : method.type === "qris"
        ? DEFAULT_QRIS_STEPS
        : DEFAULT_TRANSFER_STEPS;

  return (
    <SectionCard className="mb-5">
      <h2 className="text-[19px] font-extrabold">Cara Pembayaran</h2>
      <p className="mt-1 text-sm opacity-75">
        Metode pembayaran: <b>{method.name}</b>
      </p>

      {method.type === "qris" ? (
        <div className="mt-4">
          {method.qrImage ? (
            <Image
              src={method.qrImage}
              alt={`Kode QRIS untuk ${method.name}`}
              width={260}
              height={260}
              className="mx-auto h-auto w-[260px] rounded-xl border-[1.5px] border-mint-2 bg-white object-contain p-2"
              unoptimized
            />
          ) : (
            <p className="rounded-xl border-[1.5px] border-line bg-peach-2 px-3 py-2 text-xs font-semibold text-coral-dark">
              Gambar QR belum diunggah admin. Hubungi CS kami untuk meminta kode QRIS.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border-[1.5px] border-mint-2 bg-mint/40 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
            {method.accountLabel}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="font-display text-xl font-extrabold tracking-wide">
              {method.accountNumber || "belum diisi"}
            </span>
            {method.accountNumber ? <CopyButton value={method.accountNumber} /> : null}
          </div>
          {method.accountName ? (
            <p className="mt-1 text-xs opacity-75">a.n. {method.accountName}</p>
          ) : null}
        </div>
      )}

      <ol className="mt-4 space-y-2 text-sm">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`} className="flex gap-2">
            <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-mint text-[11px] font-bold text-green-dd">
              {index + 1}
            </span>
            <span className="opacity-85">{step}</span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

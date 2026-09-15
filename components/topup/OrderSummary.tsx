import { SectionCard } from "@/components/ui/SectionCard";
import { formatRupiah } from "@/lib/format";

interface OrderSummaryProps {
  gameName: string;
  account: string;
  itemLabel: string;
  paymentLabel: string;
  discount: number;
  total: number;
  error?: string | null;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="opacity-70">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}

export function OrderSummary({
  gameName,
  account,
  itemLabel,
  paymentLabel,
  discount,
  total,
  error,
}: OrderSummaryProps) {
  return (
    <SectionCard
      as="aside"
      className="border-peach bg-peach-2 lg:sticky lg:top-6"
    >
      <h2 className="mb-3 text-[19px] font-extrabold">Ringkasan Pesanan</h2>

      <dl className="space-y-2 text-sm">
        <SummaryRow label="Game" value={gameName} />
        <SummaryRow label="Akun" value={account} />
        <SummaryRow label="Item" value={itemLabel} />
        <SummaryRow label="Pembayaran" value={paymentLabel} />
        <SummaryRow label="Diskon" value={`-${formatRupiah(discount)}`} />
      </dl>

      <hr className="my-4 border-peach" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-display text-[26px] font-extrabold text-green-d">
          {formatRupiah(total)}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-[#e8b4a6] bg-white/70 px-3 py-2 text-xs font-semibold text-[#b3492f]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-green-d py-3 font-display text-lg font-bold text-white transition-colors hover:bg-green-dd"
      >
        Bayar Sekarang
      </button>
      <p className="mt-3 text-center text-[11px] opacity-70">
        Dengan melanjutkan kamu setuju dengan Syarat &amp; Ketentuan Recavix.
      </p>
    </SectionCard>
  );
}

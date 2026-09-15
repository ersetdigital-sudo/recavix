import Link from "next/link";

interface OrderSuccessProps {
  summary: string;
  whatsappHref: string;
  onReset: () => void;
}

export function OrderSuccess({
  summary,
  whatsappHref,
  onReset,
}: OrderSuccessProps) {
  return (
    <div className="card-shadow mt-6 rounded-2xl border-2 border-green bg-white p-6 text-center">
      <div aria-hidden className="mb-2 text-4xl">
        ✅
      </div>
      <h2 className="text-[22px] font-extrabold">Pesanan Dibuat!</h2>
      <p className="mt-2 text-sm opacity-80">{summary}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-green-d px-6 py-2.5 font-semibold text-white transition-colors hover:bg-green-dd"
        >
          Konfirmasi via WhatsApp
        </a>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border-2 border-green-d px-6 py-2.5 font-semibold transition-colors hover:bg-mint"
        >
          Buat Pesanan Lagi
        </button>
        <Link
          href="/"
          className="rounded-xl border-2 border-mint-2 px-6 py-2.5 font-semibold opacity-80 transition-colors hover:bg-mint"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

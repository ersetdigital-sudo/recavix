export function TransactionNotFound({ invoiceId }: { invoiceId: string }) {
  return (
    <div className="card-shadow rounded-2xl border-2 border-[#e8b4a6] bg-white p-8 text-center">
      <div aria-hidden className="mb-2 text-3xl sm:text-4xl">
        ❌
      </div>
      <h2 className="text-[18px] font-extrabold sm:text-[20px]">Invoice tidak ditemukan</h2>
      <p className="mt-1 text-sm opacity-75">
        Cek lagi penulisan Invoice ID <b>{invoiceId || "-"}</b>, atau hubungi CS
        kami.
      </p>
    </div>
  );
}

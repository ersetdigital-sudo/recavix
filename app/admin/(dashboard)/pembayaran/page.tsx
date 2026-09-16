import { savePaymentMethods } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PaymentEditor } from "@/components/admin/PaymentEditor";
import { getPaymentSnapshot } from "@/lib/payments/store";

export const metadata = {
  title: "Pembayaran",
  robots: { index: false, follow: false },
};

export default async function AdminPaymentsPage() {
  const { methods, error } = await getPaymentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Pembayaran"
        description="Atur pilihan pembayaran yang muncul di halaman checkout pembeli. Metode nonaktif otomatis disembunyikan."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <PaymentEditor methods={methods} action={savePaymentMethods} />
    </>
  );
}

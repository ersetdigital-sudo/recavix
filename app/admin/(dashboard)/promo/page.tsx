import { savePromoCodes } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { PromoDraft } from "@/types";

export const metadata = {
  title: "Promo",
  robots: { index: false, follow: false },
};

const PROMO_FIELDS: FieldDef[] = [
  {
    name: "code",
    label: "Kode promo",
    type: "text",
    placeholder: "GEMS10",
    help: "Otomatis diubah ke huruf besar, dan kode kembar dilewati.",
  },
  {
    name: "percent",
    label: "Diskon (%)",
    type: "number",
    help: "Angka 1–100. Contoh: 10 untuk diskon 10%.",
  },
];

const EMPTY_PROMO: PromoDraft = { code: "", percent: 0 };

export default async function AdminPromoPage() {
  const { content, error } = await getContentSnapshot();

  // Dokumen menyimpan diskon sebagai pecahan (0.1); form bekerja dalam persen.
  const drafts: PromoDraft[] = content.promoCodes.map((promo) => ({
    code: promo.code,
    percent: Math.round(promo.discount * 100),
  }));

  return (
    <>
      <AdminPageHeader
        title="Promo"
        description="Kode promo yang bisa dipakai pembeli di langkah terakhir checkout. Server selalu menghitung ulang diskonnya saat pesanan dibuat."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <RepeatableEditor<PromoDraft>
        title="Kode promo"
        description="Kosongkan daftarnya kalau tidak ada promo yang aktif."
        fields={PROMO_FIELDS}
        initialItems={drafts}
        emptyItem={EMPTY_PROMO}
        action={savePromoCodes}
        titleField="code"
        titlePrefix="Kode"
        addLabel="Tambah kode"
        emptyLabel="Belum ada kode promo aktif."
      />
    </>
  );
}

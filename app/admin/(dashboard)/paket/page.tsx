import { savePacks } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getCatalogSnapshot } from "@/lib/catalog/store";
import type { CatalogPack } from "@/types";

export const metadata = {
  title: "Paket Diamond",
  robots: { index: false, follow: false },
};

const PACK_FIELDS: FieldDef[] = [
  {
    name: "diamonds",
    label: "Jumlah diamond",
    type: "number",
    help: "Angka penuh, contoh 86. Wajib lebih dari 0.",
  },
  {
    name: "price",
    label: "Harga (Rupiah)",
    type: "number",
    help: "Angka penuh tanpa titik, contoh 22000.",
  },
  {
    name: "tag",
    label: "Badge (opsional)",
    type: "text",
    placeholder: "HEMAT",
    help: "Label kecil di kartu paket. Kosongkan kalau tidak perlu.",
  },
  {
    name: "isActive",
    label: "Tampilkan di checkout",
    type: "toggle",
    help: "Paket nonaktif tidak muncul di halaman top up.",
  },
];

const EMPTY_PACK: CatalogPack = {
  id: "",
  diamonds: 1,
  price: 0,
  isActive: true,
  sortOrder: 0,
};

export default async function AdminPacksPage() {
  const { packs, error } = await getCatalogSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Paket Diamond"
        description="Satu daftar paket dipakai semua game. Urutannya mengikuti daftar ini, dari atas ke bawah."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <RepeatableEditor<CatalogPack>
        title="Daftar paket"
        description="Harga diisi angka penuh. Badge muncul di pojok kartu paket."
        fields={PACK_FIELDS}
        initialItems={packs}
        emptyItem={EMPTY_PACK}
        action={savePacks}
        titlePrefix="Paket"
        addLabel="Tambah paket"
        emptyLabel="Belum ada paket. Tambahkan minimal satu."
      />
    </>
  );
}

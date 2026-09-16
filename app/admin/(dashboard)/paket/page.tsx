import Link from "next/link";

import { savePacks } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getCatalogSnapshot, packsForGame } from "@/lib/catalog/store";
import { cn } from "@/lib/cn";
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
  gameSlug: "",
  diamonds: 1,
  price: 0,
  isActive: true,
  sortOrder: 0,
};

const CHIP = "rounded-full border-[1.5px] px-4 py-1.5 text-[11px] font-bold transition-colors";

interface PageProps {
  searchParams: Promise<{ game?: string }>;
}

export default async function AdminPacksPage({ searchParams }: PageProps) {
  const [{ game: requested }, { games, packs, error }] = await Promise.all([
    searchParams,
    getCatalogSnapshot(),
  ]);

  // Semua game aktif bisa dijual, jadi semuanya bisa diatur di sini.
  const choices = games.filter((game) => game.isActive);
  const selected = choices.find((game) => game.slug === requested) ?? choices[0] ?? null;

  return (
    <>
      <AdminPageHeader
        title="Paket Diamond"
        description="Harga diatur per game. Pilih game dulu, lalu ubah nominal, harga, dan badge-nya. Game bertanda “Segera hadir” belum bisa dibeli, jadi harganya belum dipakai di checkout."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      {!selected ? (
        <p className="card-shadow rounded-2xl border border-mint-2 bg-white px-5 py-8 text-center text-xs opacity-70">
          Belum ada game aktif. Tambahkan dan aktifkan game di menu Katalog dulu.
        </p>
      ) : (
        <>
          <nav aria-label="Pilih game" className="mb-4 flex flex-wrap gap-2">
            {choices.map((game) => {
              const isCurrent = game.slug === selected.slug;

              return (
                <Link
                  key={game.slug}
                  href={`/admin/paket?game=${game.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    CHIP,
                    isCurrent
                      ? "border-green bg-mint text-green-dd"
                      : "border-mint-2 bg-white text-green-d hover:bg-mint",
                  )}
                >
                  {game.name}
                  {game.comingSoon ? (
                    <span className="ml-1 font-semibold opacity-70">· Segera hadir</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Ganti game berarti ganti isi editor — kunci ini memaksa editor
              dibuat ulang supaya tidak menampilkan paket game sebelumnya. */}
          <RepeatableEditor<CatalogPack>
            key={selected.slug}
            title={`Paket — ${selected.name}`}
            description="Harga diisi angka penuh. Badge muncul di pojok kartu paket."
            fields={PACK_FIELDS}
            initialItems={packsForGame(packs, selected.slug)}
            emptyItem={{ ...EMPTY_PACK, gameSlug: selected.slug }}
            action={savePacks.bind(null, selected.slug)}
            titlePrefix="Paket"
            addLabel="Tambah paket"
            emptyLabel="Belum ada paket. Tambahkan minimal satu."
          />
        </>
      )}
    </>
  );
}

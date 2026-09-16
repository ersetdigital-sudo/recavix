import { saveHeroSlides } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { HeroSlide } from "@/types";

export const metadata = {
  title: "Banner Hero",
  robots: { index: false, follow: false },
};

const SLIDE_FIELDS: FieldDef[] = [
  {
    name: "image",
    label: "Gambar banner",
    type: "image",
    placeholder: "/images/hero/promo-baru.png",
    help: "Idealnya 1584x672 px supaya rasionya pas dengan frame carousel.",
  },
  {
    name: "alt",
    label: "Alt text",
    type: "text",
    help: "Wajib deskriptif untuk SEO dan pembaca layar.",
  },
  {
    name: "href",
    label: "Link tujuan",
    type: "text",
    placeholder: "/topup",
    help: "Ke mana banner ini mengarah saat diklik.",
  },
  {
    name: "id",
    label: "ID unik",
    type: "text",
    help: "Boleh apa saja, tapi jangan sama dengan slide lain.",
  },
];

const EMPTY_SLIDE: HeroSlide = {
  id: "",
  image: "",
  alt: "",
  href: "/topup",
};

export default async function AdminBannerPage() {
  const { content, error } = await getContentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Banner Hero"
        description="Slider di paling atas beranda. Urutannya mengikuti daftar ini, dan berganti otomatis setiap 3,5 detik."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <RepeatableEditor<HeroSlide>
        title="Slide banner"
        description="Slide tanpa gambar dilewati saat disimpan. Kosongkan daftarnya kalau tidak ingin ada carousel."
        fields={SLIDE_FIELDS}
        initialItems={content.heroSlides}
        emptyItem={EMPTY_SLIDE}
        action={saveHeroSlides}
        titleField="alt"
        titlePrefix="Slide"
        addLabel="Tambah slide"
        emptyLabel="Belum ada slide. Beranda akan tampil tanpa carousel."
      />
    </>
  );
}

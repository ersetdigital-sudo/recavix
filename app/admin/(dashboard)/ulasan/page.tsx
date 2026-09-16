import { saveFaq, saveTestimonials } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { FaqItem, Testimonial } from "@/types";

export const metadata = {
  title: "Ulasan & FAQ",
  robots: { index: false, follow: false },
};

const TESTIMONIAL_FIELDS: FieldDef[] = [
  { name: "name", label: "Nama", type: "text" },
  {
    name: "role",
    label: "Keterangan",
    type: "text",
    placeholder: "Mobile Legends",
    help: "Biasanya nama game yang mereka top up.",
  },
  {
    name: "rating",
    label: "Rating (1–5)",
    type: "number",
    help: "Ditampilkan sebagai bintang di kartu ulasan.",
  },
  { name: "quote", label: "Isi ulasan", type: "textarea", wide: true },
];

const FAQ_FIELDS: FieldDef[] = [
  { name: "question", label: "Pertanyaan", type: "text", wide: true },
  { name: "answer", label: "Jawaban", type: "textarea", wide: true },
];

const EMPTY_TESTIMONIAL: Testimonial = { name: "", role: "", quote: "", rating: 5 };
const EMPTY_FAQ: FaqItem = { question: "", answer: "" };

export default async function AdminReviewsPage() {
  const { content, error } = await getContentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Ulasan & FAQ"
        description="Ulasan pelanggan di beranda, dan pertanyaan umum yang sekaligus dipakai sebagai data FAQPage untuk mesin pencari."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <RepeatableEditor<Testimonial>
        title="Ulasan di beranda"
        description="Tampil di bagian “Kata Pelanggan”."
        fields={TESTIMONIAL_FIELDS}
        initialItems={content.testimonials}
        emptyItem={EMPTY_TESTIMONIAL}
        action={saveTestimonials}
        titleField="name"
        titlePrefix="Ulasan"
        addLabel="Tambah ulasan"
        emptyLabel="Belum ada ulasan. Bagian ulasan tidak ditampilkan di beranda."
      />

      <RepeatableEditor<FaqItem>
        title="Pertanyaan umum"
        description="Muncul sebagai accordion di beranda, dan ikut dikirim sebagai JSON-LD FAQPage."
        fields={FAQ_FIELDS}
        initialItems={content.faq}
        emptyItem={EMPTY_FAQ}
        action={saveFaq}
        titleField="question"
        titlePrefix="Pertanyaan"
        addLabel="Tambah pertanyaan"
        emptyLabel="Belum ada pertanyaan. Bagian FAQ tidak ditampilkan."
      />
    </>
  );
}

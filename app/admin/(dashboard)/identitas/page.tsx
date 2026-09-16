import { saveContact, saveHeaderNav, saveHelpNav, saveIdentity, saveSocial } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  ObjectEditor,
  RepeatableEditor,
  type FieldDef,
} from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { NavItem } from "@/types";

export const metadata = {
  title: "Identitas & Navigasi",
  robots: { index: false, follow: false },
};

const IDENTITY_FIELDS: FieldDef[] = [
  {
    name: "name",
    label: "Nama brand",
    type: "text",
    help: "Dua huruf terakhir otomatis diberi warna aksen di logo.",
  },
  {
    name: "shortName",
    label: "Nama pendek",
    type: "text",
    help: "Dipakai kalau ruangnya sempit. Kosongkan untuk memakai nama brand.",
  },
  { name: "tagline", label: "Tagline", type: "text", wide: true },
  {
    name: "description",
    label: "Deskripsi situs",
    type: "textarea",
    wide: true,
    help: "Dipakai untuk meta description, JSON-LD, dan teks di footer.",
  },
];

const CONTACT_FIELDS: FieldDef[] = [
  {
    name: "email",
    label: "Email CS",
    type: "text",
    help: "Tampil di footer dan dipakai JSON-LD Organization.",
  },
  {
    name: "whatsapp",
    label: "Nomor WhatsApp",
    type: "text",
    placeholder: "6281234567890",
    help: "Format internasional tanpa + dan tanpa spasi. Hanya digit yang disimpan.",
  },
  {
    name: "whatsappDisplay",
    label: "Nomor WhatsApp (tampilan)",
    type: "text",
    placeholder: "+62 812-3456-7890",
    help: "Versi yang enak dibaca, dipakai di footer.",
  },
];

const SOCIAL_FIELDS: FieldDef[] = [
  {
    name: "instagram",
    label: "Instagram",
    type: "text",
    placeholder: "https://instagram.com/namakamu",
  },
  { name: "facebook", label: "Facebook", type: "text", placeholder: "https://facebook.com/namakamu" },
  { name: "tiktok", label: "TikTok", type: "text", placeholder: "https://tiktok.com/@namakamu" },
];

const NAV_FIELDS: FieldDef[] = [
  { name: "label", label: "Teks menu", type: "text" },
  { name: "href", label: "Link", type: "text", placeholder: "/topup" },
];

const EMPTY_NAV: NavItem = { label: "", href: "" };

export default async function AdminIdentityPage() {
  const { content, error } = await getContentSnapshot();
  const { settings, navigation } = content;

  return (
    <>
      <AdminPageHeader
        title="Identitas & Navigasi"
        description="Nama brand, kontak, media sosial, dan menu di header serta footer."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <ObjectEditor
        title="Identitas brand"
        description="Nama brand langsung dipakai di logo, judul halaman, dan metadata SEO."
        fields={IDENTITY_FIELDS}
        initial={{
          name: settings.name,
          shortName: settings.shortName,
          tagline: settings.tagline,
          description: settings.description,
        }}
        action={saveIdentity}
      />

      <ObjectEditor
        title="Kontak"
        description="Email dan nomor WhatsApp dipakai di footer, halaman cek transaksi, dan tautan konfirmasi pesanan."
        fields={CONTACT_FIELDS}
        initial={settings.contact}
        action={saveContact}
      />

      <ObjectEditor
        title="Media sosial"
        description="Kosongkan URL kalau platformnya belum dipakai."
        fields={SOCIAL_FIELDS}
        initial={settings.social}
        action={saveSocial}
      />

      <RepeatableEditor<NavItem>
        title="Menu header"
        description="Muncul di navigasi atas, dan di kolom Menu pada footer."
        fields={NAV_FIELDS}
        initialItems={navigation.header}
        emptyItem={EMPTY_NAV}
        action={saveHeaderNav}
        titleField="label"
        titlePrefix="Menu"
        addLabel="Tambah menu"
      />

      <RepeatableEditor<NavItem>
        title="Menu bantuan (footer)"
        description="Tautan tambahan di kolom Bantuan pada footer."
        fields={NAV_FIELDS}
        initialItems={navigation.help}
        emptyItem={EMPTY_NAV}
        action={saveHelpNav}
        titleField="label"
        titlePrefix="Link"
        addLabel="Tambah link"
      />
    </>
  );
}

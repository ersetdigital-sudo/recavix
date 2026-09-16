"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FieldGrid, Panel, SaveButton, StatusText } from "@/components/admin/fields";
import type { ActionResult, FieldDef } from "@/components/admin/fields";
import { GAME_CATEGORIES, GAME_PLATFORMS } from "@/data/games";
import { SECOND_ID_KINDS, SECOND_ID_KIND_LABEL } from "@/lib/catalog/id-fields";
import type { CatalogGame } from "@/types";

const FIELDS: FieldDef[] = [
  {
    name: "isActive",
    label: "Tampilkan di situs",
    type: "toggle",
    help: "Kalau dimatikan, game ini hilang dari beranda, katalog, dan sitemap. Datanya tetap tersimpan lengkap, jadi bisa dinyalakan lagi kapan saja.",
  },
  {
    name: "comingSoon",
    label: "Segera hadir",
    type: "toggle",
    help: "Game tetap tampil di beranda dan katalog dengan badge “Segera Hadir”, tapi pembeli belum bisa memilihnya di checkout. Nyalakan tombol belinya dengan mematikan opsi ini.",
  },
  {
    name: "name",
    label: "Nama game",
    type: "text",
    help: "Dipakai sebagai judul kartu dan alt text.",
  },
  {
    name: "slug",
    label: "Slug URL",
    type: "text",
    help: "Dipakai di data game, contoh mobile-legends.",
  },
  {
    name: "rating",
    label: "Rating (1–5)",
    type: "number",
    help: "Ditampilkan sebagai bintang di kartu game.",
  },
  {
    name: "category",
    label: "Kategori",
    type: "select",
    options: GAME_CATEGORIES.map((category) => ({ value: category, label: category })),
  },
  {
    name: "platform",
    label: "Platform",
    type: "select",
    options: GAME_PLATFORMS.map((platform) => ({ value: platform, label: platform })),
  },
  {
    name: "image",
    label: "Ikon game",
    type: "image",
    placeholder: "/images/games/nama-game.png",
    help: "Idealnya gambar persegi, minimal 320x320 px.",
  },
  {
    name: "idLabel",
    label: "Label kolom ID",
    type: "text",
    placeholder: "User ID",
    help: "Ditulis di form checkout. Contoh: User ID, UID, Player ID, Username.",
  },
  {
    name: "secondKind",
    label: "Kolom kedua di checkout",
    type: "select",
    options: SECOND_ID_KINDS.map((kind) => ({ value: kind, label: SECOND_ID_KIND_LABEL[kind] })),
    help: "Mobile Legends & Magic Chess butuh Zone ID, Genshin Impact butuh pilihan Server, PUBG/Free Fire/Roblox cukup satu kolom.",
  },
  {
    name: "secondLabel",
    label: "Label kolom kedua",
    type: "text",
    placeholder: "Zone ID",
    help: "Dipakai kalau kolom kedua berupa isian bebas atau pilihan.",
  },
  {
    name: "secondOptions",
    label: "Pilihan kolom kedua",
    type: "list",
    placeholder: "Asia, America, Europe, TW/HK/MO",
    help: "Pisahkan dengan koma. Hanya dipakai kalau kolom kedua bertipe pilihan.",
  },
];

interface GameEditorProps {
  games: CatalogGame[];
  gameIndex: number;
  /** Server action app/admin/actions.ts. */
  action: (games: CatalogGame[]) => Promise<ActionResult>;
}

export function GameEditor({ games, gameIndex, action }: GameEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<CatalogGame[]>(games);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const game = draft[gameIndex];
  if (!game) return null;

  const mutate = (name: string, value: unknown) => {
    setDraft((current) =>
      current.map((entry, index) =>
        index === gameIndex ? ({ ...entry, [name]: value } as CatalogGame) : entry,
      ),
    );
    setStatus(null);
  };

  const remove = () => {
    const next = draft.filter((_, index) => index !== gameIndex);
    startTransition(async () => {
      const result = await action(next);
      if (result.ok) router.push("/admin/katalog");
      else setStatus(result);
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await action(draft);
          setStatus(result);
          if (result.ok) router.refresh();
        });
      }}
      className="space-y-5"
    >
      <div className="card-shadow flex items-center gap-4 overflow-hidden rounded-2xl border border-mint-2 bg-white p-4">
        <Image
          src={game.image || "/icons/icon-192.png"}
          alt={game.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-xl bg-mint object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-[17px] font-extrabold">{game.name}</p>
          <p className="text-xs opacity-70">
            {game.isActive ? "Tampil di situs" : "Disembunyikan"} · /{game.slug}
          </p>
        </div>
      </div>

      <Panel
        title="Informasi game"
        description="Perubahan baru tampil di situs setelah tombol simpan ditekan."
        footer={
          <>
            <SaveButton pending={pending} />
            <StatusText status={status} />
          </>
        }
      >
        <FieldGrid fields={FIELDS} values={game as unknown as Record<string, unknown>} onChange={mutate} />
      </Panel>

      <section className="card-shadow overflow-hidden rounded-2xl border border-line bg-peach-2/60">
        <div className="px-5 py-5">
          <h2 className="font-display text-[17px] font-extrabold text-coral">Hapus game</h2>
          <p className="mb-3 mt-1 text-xs leading-relaxed">
            Menghapus game juga menghapus kartunya dari beranda dan katalog. Tindakan ini tidak
            bisa dibatalkan. Kalau hanya ingin menyembunyikan sementara, matikan
            &ldquo;Tampilkan di situs&rdquo; saja.
          </p>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="rounded-xl bg-coral px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
          >
            Hapus game ini
          </button>
        </div>
      </section>
    </form>
  );
}

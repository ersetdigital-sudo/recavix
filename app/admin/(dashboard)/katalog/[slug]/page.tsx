import { notFound } from "next/navigation";

import { saveGames } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GameEditor } from "@/components/admin/GameEditor";
import { getCatalogSnapshot } from "@/lib/catalog/store";

export const metadata = {
  title: "Kelola game",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminGameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { games, error } = await getCatalogSnapshot();

  const gameIndex = games.findIndex((game) => game.slug === slug);
  if (gameIndex === -1) notFound();

  return (
    <>
      <AdminPageHeader
        title="Kelola game"
        description="Perubahan langsung dipakai halaman publik setelah disimpan."
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <GameEditor games={games} gameIndex={gameIndex} action={saveGames} />
    </>
  );
}

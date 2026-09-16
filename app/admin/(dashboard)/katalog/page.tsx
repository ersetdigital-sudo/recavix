import Image from "next/image";
import Link from "next/link";

import { saveGames } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComingSoonToggle } from "@/components/admin/ComingSoonToggle";
import { NewGameButton } from "@/components/admin/NewGameButton";
import { Icon } from "@/components/ui/Icon";
import { getCatalogSnapshot } from "@/lib/catalog/store";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Katalog",
  robots: { index: false, follow: false },
};

export default async function AdminCatalogPage() {
  const { games, error } = await getCatalogSnapshot();

  const activeCount = games.filter((game) => game.isActive).length;
  const hiddenCount = games.length - activeCount;

  return (
    <>
      <AdminPageHeader
        title="Katalog"
        description={`${activeCount} game tampil di situs${
          hiddenCount > 0 ? `, ${hiddenCount} disembunyikan` : ""
        }. Klik tag status di tiap baris untuk membuka atau menutup penjualan game, atau “Kelola” untuk mengubah detailnya.`}
        action={<NewGameButton games={games} action={saveGames} />}
      />

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <div className="card-shadow overflow-hidden rounded-2xl border border-mint-2 bg-white">
        <ul className="divide-y divide-mint-2">
          {games.map((game, index) => (
            <li
              key={game.slug}
              className={cn(
                "flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-mint/30",
                !game.isActive && "bg-mint/20",
              )}
            >
              <Image
                src={game.image || "/icons/icon-192.png"}
                alt={game.name}
                width={48}
                height={48}
                className={cn(
                  "h-12 w-12 rounded-xl bg-mint object-cover",
                  !game.isActive && "opacity-40 grayscale",
                )}
              />
              <div className="min-w-0">
                <p className={cn("truncate text-sm font-bold", !game.isActive && "opacity-70")}>
                  {game.name}
                </p>
                <p className="truncate text-[11px] opacity-60">
                  {game.category} · {game.platform} · /{game.slug}
                </p>
              </div>

              {!game.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-line bg-white px-2.5 py-0.5 text-[10px] font-bold text-coral">
                  <Icon name="eyeOff" className="h-3 w-3" />
                  Disembunyikan
                </span>
              ) : null}

              <div className="ml-auto" />

              <ComingSoonToggle games={games} gameIndex={index} action={saveGames} />

              <Link
                href={`/admin/katalog/${game.slug}`}
                className="rounded-full border-[1.5px] border-green px-4 py-1.5 text-[11px] font-bold text-green-d transition-colors hover:bg-mint"
              >
                Kelola
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

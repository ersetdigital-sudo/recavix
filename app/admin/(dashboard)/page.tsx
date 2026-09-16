import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Metric } from "@/components/admin/Metric";
import { ResetContentButton } from "@/components/admin/ResetContentButton";
import { Icon } from "@/components/ui/Icon";
import { getCatalogSnapshot, packsForGame } from "@/lib/catalog/store";
import { formatRupiah } from "@/lib/format";
import { getOrderStats } from "@/lib/orders/store";
import { getPaymentSnapshot } from "@/lib/payments/store";

export const metadata = {
  title: "Ringkasan",
  robots: { index: false, follow: false },
};

const CARD = "card-shadow overflow-hidden rounded-2xl border border-mint-2 bg-white";

export default async function AdminDashboardPage() {
  const [catalog, payments, orders] = await Promise.all([
    getCatalogSnapshot(),
    getPaymentSnapshot(),
    getOrderStats(),
  ]);

  const { stats, error: ordersError } = orders;

  const games = catalog.games;
  const activeGames = games.filter((game) => game.isActive);
  const hiddenGames = games.filter((game) => !game.isActive);
  const activeMethods = payments.methods.filter((method) => method.isActive);

  // Harga diatur per game, jadi ringkasannya pun per game.
  const pricingRows = activeGames.map((game) => {
    const gamePacks = packsForGame(catalog.packs, game.slug).filter((pack) => pack.isActive);
    const cheapest = gamePacks.reduce<number | null>(
      (min, pack) => (min === null || pack.price < min ? pack.price : min),
      null,
    );

    return { game, count: gamePacks.length, cheapest };
  });

  const checkoutPackCount = pricingRows.reduce((total, row) => total + row.count, 0);

  return (
    <>
      <AdminPageHeader
        title="Ringkasan"
        description="Semua yang diubah di sini langsung dipakai halaman publik setelah disimpan."
      />

      {catalog.error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {catalog.error}
        </p>
      ) : null}

      {payments.error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {payments.error}
        </p>
      ) : null}

      {ordersError ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {ordersError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          label="Total dibayar"
          value={formatRupiah(stats.revenue)}
          icon="card"
          hint="ditandai bayar + selesai"
        />
        <Metric
          label="Perlu diverifikasi"
          value={stats.dibayar}
          icon="clock"
          tone="bg-mint text-green-dd"
          hint="pembeli bilang sudah bayar"
        />
        <Metric
          label="Menunggu bayar"
          value={stats.menunggu}
          icon="alert"
          tone="bg-[#fdeccb] text-[#96692a]"
          hint="belum dibayar"
        />
        <Metric
          label="Game aktif"
          value={activeGames.length}
          icon="check"
          hint={`dari ${games.length} game`}
        />
        <Metric
          label="Paket diamond"
          value={checkoutPackCount}
          icon="gem"
          hint={pricingRows.length === 0 ? "belum ada game checkout" : `di ${pricingRows.length} game`}
        />
        <Metric
          label="Metode bayar"
          value={activeMethods.length}
          icon="wallet"
          hint={`dari ${payments.methods.length} metode`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={CARD}>
          <header className="flex items-center gap-3 border-b border-mint-2 bg-mint/40 px-5 py-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-green-d">
              <Icon name="gem" />
            </span>
            <h2 className="mr-auto font-display text-[15px] font-extrabold">Harga paket diamond</h2>
            <Link href="/admin/paket" className="text-[11px] font-bold text-green-d underline">
              Kelola
            </Link>
          </header>
          {pricingRows.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs opacity-70">
              Belum ada game yang muncul di checkout.
            </p>
          ) : (
            <ul className="divide-y divide-mint-2">
              {pricingRows.map((row) => (
                <li key={row.game.slug} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">
                      {row.game.name}
                      {row.game.comingSoon ? (
                        <span className="ml-1 font-semibold text-green-d opacity-80">
                          · Segera hadir
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11px] opacity-60">{row.count} nominal</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-d">
                    {row.cheapest === null ? "—" : `mulai ${formatRupiah(row.cheapest)}`}
                  </span>
                  <Link
                    href={`/admin/paket?game=${row.game.slug}`}
                    className="rounded-lg border-[1.5px] border-mint-2 px-3 py-1.5 text-[11px] font-bold hover:bg-mint"
                  >
                    Atur
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={CARD}>
          <header className="flex items-center gap-3 border-b border-mint-2 bg-mint/40 px-5 py-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-green-d">
              <Icon name="gamepad" />
            </span>
            <h2 className="mr-auto font-display text-[15px] font-extrabold">Game disembunyikan</h2>
            <Link href="/admin/katalog" className="text-[11px] font-bold text-green-d underline">
              Kelola
            </Link>
          </header>

          {hiddenGames.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs opacity-70">
              Semua game sedang tampil di situs.
            </p>
          ) : (
            <ul className="divide-y divide-mint-2">
              {hiddenGames.map((game) => (
                <li key={game.slug} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{game.name}</p>
                    <p className="text-[11px] opacity-60">
                      {game.category} · {game.platform}
                    </p>
                  </div>
                  <Link
                    href={`/admin/katalog/${game.slug}`}
                    className="ml-auto rounded-lg border-[1.5px] border-mint-2 px-3 py-1.5 text-[11px] font-bold hover:bg-mint"
                  >
                    Buka
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card-shadow overflow-hidden rounded-2xl border border-line bg-peach-2/60">
        <div className="px-5 py-5">
          <h2 className="font-display text-[17px] font-extrabold text-coral">
            Kembalikan ke isi awal
          </h2>
          <p className="mb-3 mt-1 text-xs leading-relaxed">
            Menghapus semua perubahan yang tersimpan di katalog dan memakai kembali isi bawaan.
            Tindakan ini tidak bisa dibatalkan.
          </p>
          <ResetContentButton />
        </div>
      </section>
    </>
  );
}

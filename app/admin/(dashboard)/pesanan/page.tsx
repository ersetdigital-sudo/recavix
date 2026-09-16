import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Metric } from "@/components/admin/Metric";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { cn } from "@/lib/cn";
import { formatDateTime, formatRupiah } from "@/lib/format";
import {
  ORDER_STATUSES,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
  isOrderStatus,
} from "@/lib/orders/status";
import { getOrderStats, getOrdersSnapshot } from "@/lib/orders/store";
import type { OrderStatus } from "@/types";

export const metadata = {
  title: "Pesanan",
  robots: { index: false, follow: false },
};

const LIMIT = 100;
const CARD = "card-shadow overflow-hidden rounded-2xl border border-mint-2 bg-white";

type FilterKey = OrderStatus | "all";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.status) ? params.status[0] : params.status;
  const filter: FilterKey = raw && isOrderStatus(raw) ? raw : "all";

  const [snapshot, statsResult] = await Promise.all([
    getOrdersSnapshot({ status: filter === "all" ? undefined : filter, limit: LIMIT }),
    getOrderStats(),
  ]);

  const { orders, error } = snapshot;
  const { stats, error: statsError } = statsResult;

  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: stats.total },
    ...ORDER_STATUSES.map((status) => ({
      key: status as FilterKey,
      label: ORDER_STATUS_LABEL[status],
      count: stats[status],
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Pesanan"
        description="Pesanan tercatat otomatis begitu pembeli menekan “Bayar Sekarang”. Verifikasi pembayaran lalu ubah statusnya di sini."
      />

      {statsError ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {statsError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          label="Selesai"
          value={stats.selesai}
          icon="check"
          tone="bg-[#dff0d8] text-[#3f6a3b]"
          hint={`${stats.total} pesanan tercatat`}
        />
      </div>

      {error ? (
        <p className="card-shadow rounded-2xl border-[1.5px] border-line bg-peach-2 px-4 py-3.5 text-xs font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/pesanan" : `/admin/pesanan?status=${tab.key}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-[1.5px] px-3.5 py-2 text-xs font-bold transition-colors",
                active
                  ? "border-green-d bg-green-d text-white"
                  : "border-mint-2 bg-white hover:bg-mint",
              )}
            >
              {tab.label}
              <span className={cn("tabular-nums", active ? "text-white/80" : "opacity-60")}>
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className={cn(CARD, "px-6 py-14 text-center")}>
          <p className="text-sm font-extrabold">
            {stats.total === 0 ? "Belum ada pesanan masuk" : "Tidak ada pesanan di status ini"}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed opacity-70">
            {stats.total === 0
              ? "Pesanan muncul di sini begitu ada pembeli yang menyelesaikan checkout di halaman top up."
              : "Coba pilih status lain, atau kembali ke daftar semua pesanan."}
          </p>
          <Link
            href={stats.total === 0 ? "/topup" : "/admin/pesanan"}
            target={stats.total === 0 ? "_blank" : undefined}
            className="mt-5 inline-block rounded-xl bg-green-d px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-dd"
          >
            {stats.total === 0 ? "Lihat halaman top up" : "Lihat semua pesanan"}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className={CARD}>
              <div className="flex flex-wrap items-center gap-3 border-b border-mint-2 bg-mint/40 px-5 py-3.5">
                <span className="font-mono text-xs font-extrabold">{order.invoice}</span>
                <span
                  className={cn(
                    "rounded-full border-[1.5px] px-2.5 py-0.5 text-[10px] font-bold",
                    ORDER_STATUS_CLASS[order.status],
                  )}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
                <span className="text-[11px] opacity-60">
                  {formatDateTime(order.createdAt)}
                </span>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <Link
                    href={`/pembayaran/${encodeURIComponent(order.invoice)}`}
                    target="_blank"
                    className="rounded-full border-[1.5px] border-mint-2 bg-white px-3 py-1.5 text-[11px] font-bold transition-colors hover:border-green hover:text-green-d"
                  >
                    Halaman bayar
                  </Link>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </div>

              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Game", value: order.gameName },
                  { label: "Nominal", value: order.itemLabel },
                  {
                    label: "Akun",
                    value: `${order.accountId}${order.zoneId ? ` (${order.zoneId})` : ""}`,
                  },
                  { label: "Metode", value: order.paymentMethod },
                ].map((row) => (
                  <div key={row.label} className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                      {row.label}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-bold">{row.value}</p>
                  </div>
                ))}
              </div>

              {order.contact ? (
                <div className="px-5 pb-3 text-[11px] opacity-70">
                  Kontak pembeli: <b>{order.contact}</b>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-mint-2 bg-mint/20 px-5 py-3 text-[11px] opacity-80">
                <span>
                  Subtotal <b>{formatRupiah(order.subtotal)}</b>
                </span>
                {order.discount > 0 ? (
                  <span>
                    Diskon{order.promoCode ? ` (${order.promoCode})` : ""}{" "}
                    <b>-{formatRupiah(order.discount)}</b>
                  </span>
                ) : null}
                <span className="ml-auto text-xs">
                  Total{" "}
                  <b className="font-display text-base font-black text-green-d">
                    {formatRupiah(order.total)}
                  </b>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {orders.length === LIMIT ? (
        <p className="text-center text-[11px] opacity-60">
          Menampilkan {LIMIT} pesanan terbaru. Angka di atas dihitung dari seluruh pesanan.
        </p>
      ) : null}
    </>
  );
}

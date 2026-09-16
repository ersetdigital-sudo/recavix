import Link from "next/link";

import { StatusTimeline } from "@/components/transactions/StatusTimeline";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn } from "@/lib/cn";
import { formatDateTime, formatRupiah } from "@/lib/format";
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_CUSTOMER_ICON,
  ORDER_STATUS_CUSTOMER_LABEL,
  buildOrderTimeline,
} from "@/lib/orders/status";
import type { Order } from "@/types";

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 border-b border-mint-2 py-1.5 last:border-0">
      <span className="opacity-70">{label}</span>
      <span className={cn("text-right font-semibold", mono && "font-mono")}>{value}</span>
    </div>
  );
}

export function TransactionDetail({ order }: { order: Order }) {
  const timeline = buildOrderTimeline(order.status, new Date(order.createdAt));

  return (
    <div>
      <SectionCard className="mb-5">
        <div className="flex flex-wrap items-start gap-3">
          <div aria-hidden className="text-3xl">
            {ORDER_STATUS_CUSTOMER_ICON[order.status]}
          </div>
          <div>
            <h2 className="font-mono text-[22px] font-extrabold leading-tight">{order.invoice}</h2>
            <p className="text-sm opacity-70">{formatDateTime(order.createdAt)}</p>
          </div>
          <span
            className={cn(
              "ml-auto rounded-full border-[1.5px] px-3 py-1 text-xs font-bold",
              ORDER_STATUS_CLASS[order.status],
            )}
          >
            {ORDER_STATUS_CUSTOMER_LABEL[order.status]}
          </span>
        </div>

        <div className="mt-4 text-sm">
          <DetailRow label="Game" value={order.gameName} />
          <DetailRow label="Item" value={order.itemLabel} />
          <DetailRow
            label="Akun"
            value={`${order.accountId}${order.zoneId ? ` (${order.zoneId})` : ""}`}
            mono
          />
          <DetailRow label="Metode Bayar" value={order.paymentMethod} />
          <DetailRow label="Subtotal" value={formatRupiah(order.subtotal)} />
          {order.discount > 0 ? (
            <DetailRow
              label={`Diskon${order.promoCode ? ` (${order.promoCode})` : ""}`}
              value={`-${formatRupiah(order.discount)}`}
            />
          ) : null}
          <DetailRow label="Total" value={formatRupiah(order.total)} />
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="mb-4 text-[19px] font-extrabold">Riwayat Status</h3>
        <StatusTimeline steps={timeline.steps} done={timeline.done} />

        <div className="mt-2 flex flex-wrap gap-3">
          {order.status === "menunggu" ? (
            <Link
              href={`/pembayaran/${encodeURIComponent(order.invoice)}`}
              className="inline-block rounded-xl bg-green-d px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dd"
            >
              Lanjutkan Pembayaran
            </Link>
          ) : null}
          <Link
            href="/topup"
            className="inline-block rounded-xl border-2 border-mint-2 px-5 py-2.5 text-sm font-semibold opacity-80 transition-colors hover:bg-mint"
          >
            Top Up Lagi
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

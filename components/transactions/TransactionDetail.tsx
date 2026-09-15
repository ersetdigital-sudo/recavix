import Link from "next/link";

import { StatusTimeline } from "@/components/transactions/StatusTimeline";
import { SectionCard } from "@/components/ui/SectionCard";
import { statusMeta } from "@/data/transactions";
import type { Transaction } from "@/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-mint-2 py-1.5 last:border-0">
      <span className="opacity-70">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

export function TransactionDetail({ transaction }: { transaction: Transaction }) {
  const meta = statusMeta[transaction.status];

  return (
    <div>
      <SectionCard className="mb-5">
        <div className="flex flex-wrap items-start gap-3">
          <div aria-hidden className="text-3xl">
            {meta.icon}
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold leading-tight">
              {transaction.id}
            </h2>
            <p className="text-sm opacity-70">{transaction.date}</p>
          </div>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${meta.badgeClass}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="mt-4 text-sm">
          <DetailRow label="Game" value={transaction.game} />
          <DetailRow label="Item" value={transaction.item} />
          <DetailRow label="Akun" value={transaction.account} />
          <DetailRow label="Metode Bayar" value={transaction.payment} />
          <DetailRow label="Total" value={transaction.total} />
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="mb-4 text-[19px] font-extrabold">Riwayat Status</h3>
        <StatusTimeline steps={transaction.steps} done={transaction.done} />
        <Link
          href="/topup"
          className="mt-2 inline-block rounded-xl bg-green-d px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dd"
        >
          Top Up Lagi
        </Link>
      </SectionCard>
    </div>
  );
}

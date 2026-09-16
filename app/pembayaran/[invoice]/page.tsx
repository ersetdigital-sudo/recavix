import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MarkPaidButton } from "@/components/order/MarkPaidButton";
import { PaymentCountdown } from "@/components/order/PaymentCountdown";
import { PaymentInstructions } from "@/components/order/PaymentInstructions";
import { StatusTimeline } from "@/components/transactions/StatusTimeline";
import { TransactionNotFound } from "@/components/transactions/TransactionNotFound";
import { SectionCard } from "@/components/ui/SectionCard";
import { getSiteContent } from "@/lib/content/store";
import { cn } from "@/lib/cn";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { findOrderByInvoice } from "@/lib/orders/store";
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_CUSTOMER_LABEL,
  buildOrderTimeline,
} from "@/lib/orders/status";
import { findPaymentMethod } from "@/lib/payments/store";
import type { Order } from "@/types";

export const metadata = {
  title: "Pembayaran",
  // URL-nya membawa data pesanan, jadi tidak boleh masuk indeks mesin pencari.
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ invoice: string }>;
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 border-b border-mint-2 py-1.5 last:border-0">
      <span className="opacity-70">{label}</span>
      <span className={cn("text-right font-semibold", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="opacity-70">{label}</dt>
      <dd className={cn("text-right font-semibold", strong && "text-coral")}>{value}</dd>
    </div>
  );
}

export default async function PaymentPage({ params }: PageProps) {
  const { invoice } = await params;
  const code = decodeURIComponent(invoice).trim();

  let order: Order | null = null;
  let failed = false;

  try {
    order = await findOrderByInvoice(code);
  } catch {
    failed = true;
  }

  const { settings } = await getSiteContent();
  const method = order ? await findPaymentMethod(order.paymentMethodId) : null;
  const timeline = order ? buildOrderTimeline(order.status, new Date(order.createdAt)) : null;

  const whatsappHref = order
    ? `https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
        `Halo ${settings.name}, saya sudah membuat pesanan ${order.invoice} sebesar ${formatRupiah(
          order.total,
        )}. Mohon dibantu prosesnya ya.`,
      )}`
    : "";

  return (
    <>
      <Header />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Pembayaran", href: "/pembayaran" },
              { label: code || "-" },
            ]}
            className="mb-3"
          />

          {failed ? (
            <div className="card-shadow rounded-2xl border-2 border-line bg-white p-8 text-center">
              <h1 className="text-[20px] font-extrabold">Data pesanan gagal dimuat</h1>
              <p className="mt-1 text-sm opacity-75">
                Coba muat ulang halaman ini sebentar lagi. Kalau masih gagal, hubungi{" "}
                <a className="underline" href={`mailto:${settings.contact.email}`}>
                  {settings.contact.email}
                </a>
                .
              </p>
            </div>
          ) : !order ? (
            <TransactionNotFound invoiceId={code} />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
              <div>
                <SectionCard className="mb-5">
                  <div className="flex flex-wrap items-start gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                        Invoice
                      </p>
                      <h1 className="font-mono text-[22px] font-extrabold leading-tight">
                        {order.invoice}
                      </h1>
                      <p className="text-sm opacity-70">
                        Dibuat {formatDateTime(order.createdAt)}
                      </p>
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
                    <DetailRow label="Metode bayar" value={order.paymentMethod} />
                    {order.contact ? <DetailRow label="Kontak" value={order.contact} /> : null}
                  </div>
                </SectionCard>

                {order.status === "menunggu" ? (
                  <PaymentInstructions method={method} />
                ) : (
                  <SectionCard className="mb-5">
                    <h2 className="text-[19px] font-extrabold">
                      {order.status === "batal"
                        ? "Pesanan dibatalkan"
                        : "Pembayaran sudah kami terima"}
                    </h2>
                    <p className="mt-2 text-sm opacity-75">
                      {order.status === "batal"
                        ? "Pesanan ini sudah dibatalkan. Silakan buat pesanan baru atau hubungi CS kami."
                        : "Terima kasih! Pesanan kamu sedang diproses admin. Simpan nomor invoice ini untuk melacak statusnya."}
                    </p>
                  </SectionCard>
                )}

                {timeline ? (
                  <SectionCard>
                    <h2 className="mb-4 text-[19px] font-extrabold">Riwayat Status</h2>
                    <StatusTimeline steps={timeline.steps} done={timeline.done} />
                  </SectionCard>
                ) : null}
              </div>

              <SectionCard as="aside" className="border-peach bg-peach-2 lg:sticky lg:top-6">
                <h2 className="mb-3 text-[19px] font-extrabold">Ringkasan</h2>

                <dl className="space-y-2 text-sm">
                  <SummaryRow label="Subtotal" value={formatRupiah(order.subtotal)} />
                  {order.discount > 0 ? (
                    <SummaryRow
                      label={`Diskon${order.promoCode ? ` (${order.promoCode})` : ""}`}
                      value={`-${formatRupiah(order.discount)}`}
                      strong
                    />
                  ) : null}
                  {order.fee > 0 ? (
                    <SummaryRow label="Biaya layanan" value={formatRupiah(order.fee)} />
                  ) : null}
                </dl>

                <hr className="my-4 border-peach" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-[26px] font-extrabold text-green-d">
                    {formatRupiah(order.total)}
                  </span>
                </div>

                {order.status === "menunggu" ? (
                  <>
                    <div className="mt-3 text-center">
                      <PaymentCountdown createdAt={order.createdAt} />
                    </div>
                    <div className="mt-4">
                      <MarkPaidButton invoice={order.invoice} />
                    </div>
                    <p className="mt-3 text-center text-[11px] opacity-70">
                      Setelah kamu menekan tombol di atas, admin akan memverifikasi mutasinya
                      dulu sebelum pesanan dikirim.
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block rounded-xl border-2 border-green-d px-5 py-2.5 text-center text-sm font-semibold transition-colors hover:bg-mint"
                    >
                      Konfirmasi via WhatsApp
                    </a>
                  </>
                ) : (
                  <Link
                    href={`/cek-transaksi?invoice=${encodeURIComponent(order.invoice)}`}
                    className="mt-4 block rounded-xl border-2 border-mint-2 px-5 py-2.5 text-center text-sm font-semibold opacity-80 transition-colors hover:bg-mint"
                  >
                    Lacak pesanan ini
                  </Link>
                )}
              </SectionCard>
            </div>
          )}
        </Container>
      </main>

      <Footer variant="slim" />
    </>
  );
}

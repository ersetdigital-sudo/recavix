import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TransactionDetail } from "@/components/transactions/TransactionDetail";
import { TransactionNotFound } from "@/components/transactions/TransactionNotFound";
import { SectionCard } from "@/components/ui/SectionCard";
import { getSiteContent } from "@/lib/content/store";
import {
  HERO_BANNER_HEIGHT,
  HERO_BANNER_SIZES,
  HERO_BANNER_WIDTH,
} from "@/lib/media";
import { findOrderByInvoice } from "@/lib/orders/store";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import type { Order } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return createMetadata({
    siteName: settings.name,
    title: "Cek Transaksi",
    description:
      "Lacak status pesanan top up kamu dengan Invoice ID. Lihat riwayat pembayaran dan progres pengiriman diamond secara real-time di Recavix.",
    path: "/cek-transaksi",
    image: "/images/hero/cek-transaksi.png",
  });
}

interface PageProps {
  searchParams: Promise<{ invoice?: string; akun?: string }>;
}

export default async function CekTransaksiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const invoice = (params.invoice ?? "").trim();
  const accountId = (params.akun ?? "").trim();

  const { settings } = await getSiteContent();

  let order: Order | null = null;
  let failed = false;

  // Invoice saja tidak cukup: nomornya berformat urut dan bisa ditebak, jadi
  // User ID diminta sebagai faktor kedua sebelum detail pesanan ditampilkan.
  if (invoice && accountId) {
    try {
      const found = await findOrderByInvoice(invoice);
      order =
        found && found.accountId.toLowerCase() === accountId.toLowerCase() ? found : null;
    } catch {
      failed = true;
    }
  }

  const submitted = Boolean(invoice && accountId);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Cek Transaksi", href: "/cek-transaksi" },
        ])}
      />

      <Header />

      <main id="main" className="flex-1">
        <Container className="py-6">
          {/* Rendered at the artwork's native 1584:672 ratio so the whole
              illustration (left scene + right invoice/magnifier) stays visible
              at every viewport width — no forced height, no cropping. */}
          <div className="card-shadow mb-6 overflow-hidden rounded-2xl border-2 border-white">
            <Image
              src="/images/hero/cek-transaksi.png"
              alt="Ilustrasi cek status transaksi top up game di Recavix"
              width={HERO_BANNER_WIDTH}
              height={HERO_BANNER_HEIGHT}
              priority
              sizes={HERO_BANNER_SIZES}
              className="h-auto w-full object-contain object-center"
            />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
            <SectionCard className="lg:sticky lg:top-6">
              <h1 className="text-[24px] font-extrabold leading-tight">Lacak Pesanan Kamu</h1>
              <p className="mb-4 mt-1 text-sm opacity-75">
                Masukkan Invoice ID dan User ID akun game yang kamu pakai saat top up.
              </p>

              <form className="space-y-3" method="get" action="/cek-transaksi">
                <div>
                  <label htmlFor="invoice" className="mb-1.5 block text-[13px] font-semibold">
                    Invoice ID
                  </label>
                  <input
                    id="invoice"
                    name="invoice"
                    className="field font-mono"
                    placeholder="RCV-260915-1234"
                    autoComplete="off"
                    defaultValue={invoice}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="akun" className="mb-1.5 block text-[13px] font-semibold">
                    User ID
                  </label>
                  <input
                    id="akun"
                    name="akun"
                    className="field"
                    placeholder="123456789"
                    autoComplete="off"
                    defaultValue={accountId}
                    required
                  />
                  <p className="mt-1 text-[11px] opacity-65">
                    Dipakai untuk memastikan yang membuka memang pemilik pesanannya.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-d py-3 font-display text-lg font-bold text-white transition-colors hover:bg-green-dd"
                >
                  Cek Status
                </button>
              </form>

              <div className="mt-5 border-t border-mint-2 pt-4 text-xs opacity-75">
                Invoice ID dikirim setelah kamu menyelesaikan checkout. Butuh bantuan? Hubungi{" "}
                <a className="underline" href={`mailto:${settings.contact.email}`}>
                  {settings.contact.email}
                </a>
                .
              </div>
            </SectionCard>

            <section aria-live="polite">
              {!submitted && (
                <div className="card-shadow rounded-2xl border border-peach bg-peach-2 p-8 text-center">
                  <div aria-hidden className="mb-2 text-4xl">
                    🔎
                  </div>
                  <h2 className="text-[20px] font-extrabold">Belum ada transaksi ditampilkan</h2>
                  <p className="mt-1 text-sm opacity-75">
                    Masukkan Invoice ID dan User ID di sebelah kiri untuk melihat status pesanan.
                  </p>
                  <Link
                    href="/topup"
                    className="mt-4 inline-block rounded-xl bg-green-d px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-dd"
                  >
                    Top Up Sekarang
                  </Link>
                </div>
              )}

              {failed && (
                <div className="card-shadow rounded-2xl border-2 border-line bg-white p-8 text-center">
                  <h2 className="text-[20px] font-extrabold">Data gagal dimuat</h2>
                  <p className="mt-1 text-sm opacity-75">
                    Coba muat ulang halaman ini sebentar lagi.
                  </p>
                </div>
              )}

              {submitted && !failed && order && <TransactionDetail order={order} />}

              {submitted && !failed && !order && <TransactionNotFound invoiceId={invoice} />}
            </section>
          </div>
        </Container>
      </main>

      <Footer variant="slim" />
    </>
  );
}

import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TransactionChecker } from "@/components/transactions/TransactionChecker";
import {
  HERO_BANNER_HEIGHT,
  HERO_BANNER_SIZES,
  HERO_BANNER_WIDTH,
} from "@/lib/media";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cek Transaksi",
  description:
    "Lacak status pesanan top up kamu dengan Invoice ID. Lihat riwayat pembayaran dan progres pengiriman diamond secara real-time di Recavix.",
  path: "/cek-transaksi",
  image: "/images/hero/cek-transaksi.png",
});

export default function CekTransaksiPage() {
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

          <TransactionChecker />
        </Container>
      </main>

      <Footer variant="slim" />
    </>
  );
}

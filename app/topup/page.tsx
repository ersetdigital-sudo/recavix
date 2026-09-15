import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TopupFlow } from "@/components/topup/TopupFlow";
import { diamondPacks } from "@/data/diamond-packs";
import { breadcrumbJsonLd, createMetadata, productJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Top Up Diamond",
  description:
    "Pilih nominal diamond, metode pembayaran, dan selesaikan top up dalam hitungan menit. Proses otomatis 24 jam dengan harga termurah di Recavix.",
  path: "/topup",
});

const prices = diamondPacks.map((pack) => pack.price);

export default function TopupPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Topup Game", href: "/topup" },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: "Top Up Diamond Game",
          description:
            "Layanan top up diamond, gems, dan voucher game dengan proses otomatis 24 jam.",
          path: "/topup",
          image: "/images/games/mobile-legends.png",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
        })}
      />

      <Header />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Topup", href: "/topup" },
            ]}
            className="mb-3"
          />
          <TopupFlow />
        </Container>
      </main>

      <Footer variant="slim" />
    </>
  );
}

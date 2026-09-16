import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TopupFlow } from "@/components/topup/TopupFlow";
import { CHECKOUT_GAME_SLUGS } from "@/data/games";
import { readActiveGames, readActivePacks } from "@/lib/catalog/store";
import { getSiteContent } from "@/lib/content/store";
import { getCachedPaymentMethods } from "@/lib/payments/store";
import { breadcrumbJsonLd, createMetadata, productJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return createMetadata({
    siteName: settings.name,
    title: "Top Up Diamond",
    description:
      "Pilih nominal diamond, metode pembayaran, dan selesaikan top up dalam hitungan menit. Proses otomatis 24 jam dengan harga termurah di Recavix.",
    path: "/topup",
  });
}

export default async function TopupPage() {
  const [games, packs, methods, content] = await Promise.all([
    readActiveGames(),
    readActivePacks(),
    getCachedPaymentMethods(),
    getSiteContent(),
  ]);

  // Hanya game pilihan yang muncul di selector checkout, dan hanya yang aktif.
  const checkoutGames = games.filter((game) =>
    (CHECKOUT_GAME_SLUGS as readonly string[]).includes(game.slug),
  );

  const prices = packs.map((pack) => pack.price);
  const available = checkoutGames.length > 0 && packs.length > 0 && methods.length > 0;

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
          siteName: content.settings.name,
          name: "Top Up Diamond Game",
          description:
            "Layanan top up diamond, gems, dan voucher game dengan proses otomatis 24 jam.",
          path: "/topup",
          image: "/images/games/mobile-legends.png",
          lowPrice: prices.length > 0 ? Math.min(...prices) : 0,
          highPrice: prices.length > 0 ? Math.max(...prices) : 0,
          offerCount: packs.length,
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

          {available ? (
            <TopupFlow
              games={checkoutGames}
              packs={packs}
              methods={methods}
              promos={content.promoCodes}
            />
          ) : (
            <div className="card-shadow rounded-2xl border border-mint-2 bg-white p-8 text-center">
              <p className="font-display text-lg font-extrabold">Checkout belum siap</p>
              <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
                Belum ada game, paket diamond, atau metode pembayaran yang aktif. Coba lagi
                sebentar lagi.
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer variant="slim" />
    </>
  );
}

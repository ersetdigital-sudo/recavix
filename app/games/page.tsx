import type { Metadata } from "next";

import { GamesExplorer } from "@/components/games/GamesExplorer";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { readActiveGames } from "@/lib/catalog/store";
import { getSiteContent } from "@/lib/content/store";
import { breadcrumbJsonLd, createMetadata, gameListJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return createMetadata({
    siteName: settings.name,
    title: "Semua Game",
    description:
      "Jelajahi semua game yang tersedia di Recavix — MOBA, RPG, adventure, strategy, simulator, dan sports. Filter berdasarkan kategori dan platform.",
    path: "/games",
  });
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [games, content] = await Promise.all([readActiveGames(), getSiteContent()]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Semua Game", href: "/games" },
        ])}
      />
      <JsonLd data={gameListJsonLd(games, content.settings.name)} />

      <Header />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <GamesExplorer initialQuery={q ?? ""} games={games} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

import { GamesExplorer } from "@/components/games/GamesExplorer";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata, gameListJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Semua Game",
  description:
    "Jelajahi semua game yang tersedia di Recavix — MOBA, RPG, adventure, strategy, simulator, dan sports. Filter berdasarkan kategori dan platform.",
  path: "/games",
});

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Semua Game", href: "/games" },
        ])}
      />
      <JsonLd data={gameListJsonLd()} />

      <Header />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <GamesExplorer initialQuery={q ?? ""} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

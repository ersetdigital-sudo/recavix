import type { Metadata } from "next";

import { FaqAccordion } from "@/components/home/FaqAccordion";
import { HomeExplorer } from "@/components/home/HomeExplorer";
import { Testimonials } from "@/components/home/Testimonials";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { readActiveGames } from "@/lib/catalog/store";
import { getSiteContent } from "@/lib/content/store";
import { createMetadata, faqJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return createMetadata({
    siteName: settings.name,
    // Judul beranda sudah memuat nama brand, jadi tidak perlu kena template lagi.
    title: `${settings.name} — ${settings.tagline}`,
    absoluteTitle: true,
    description: settings.description,
    path: "/",
  });
}

export default async function HomePage() {
  const [games, content] = await Promise.all([readActiveGames(), getSiteContent()]);

  return (
    <>
      <JsonLd data={faqJsonLd(content.faq)} />

      <Header showSearch />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <h1 className="sr-only">
            {content.settings.name} — top up diamond, gems, dan voucher game termurah
          </h1>

          <HomeExplorer games={games} heroSlides={content.heroSlides} />

          <section aria-labelledby="testimoni-heading" className="pb-2">
            <Reveal>
              <h2
                id="testimoni-heading"
                className="mb-3 text-[22px] font-extrabold"
              >
                <span aria-hidden>⭐</span> Kata Pelanggan
              </h2>
            </Reveal>
            <Testimonials items={content.testimonials} />
          </section>

          {/*
            Heading dan accordion dibungkus satu kolom selebar 760px lalu
            ditengahkan sebagai satu blok. Di mobile kolomnya sudah selebar layar,
            jadi `mx-auto` tidak mengubah apa pun di sana.
          */}
          <section id="faq" aria-labelledby="faq-heading" className="py-8">
            <div className="mx-auto max-w-[760px]">
              <Reveal>
                <h2 id="faq-heading" className="mb-3 text-[22px] font-extrabold">
                  <span aria-hidden>❓</span> Pertanyaan Umum
                </h2>
              </Reveal>
              <FaqAccordion items={content.faq} />
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
}

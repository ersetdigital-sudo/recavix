import { FaqAccordion } from "@/components/home/FaqAccordion";
import { HomeExplorer } from "@/components/home/HomeExplorer";
import { Testimonials } from "@/components/home/Testimonials";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { createMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Recavix — Top Up Game Termurah & Tercepat",
  description:
    "Top up diamond, gems, dan voucher game favoritmu di Recavix. Harga termurah, proses instan 24 jam, bayar via QRIS, e-wallet, atau transfer bank.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />

      <Header showSearch />

      <main id="main" className="flex-1">
        <Container className="py-6">
          <h1 className="sr-only">
            Recavix — top up diamond, gems, dan voucher game termurah
          </h1>

          <HomeExplorer />

          <section aria-labelledby="testimoni-heading" className="pb-2">
            <Reveal>
              <h2
                id="testimoni-heading"
                className="mb-3 text-[22px] font-extrabold"
              >
                <span aria-hidden>⭐</span> Kata Pelanggan
              </h2>
            </Reveal>
            <Testimonials />
          </section>

          <section id="faq" aria-labelledby="faq-heading" className="py-8">
            <Reveal>
              <h2 id="faq-heading" className="mb-3 text-[22px] font-extrabold">
                <span aria-hidden>❓</span> Pertanyaan Umum
              </h2>
            </Reveal>
            <div className="max-w-[760px]">
              <FaqAccordion />
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
}

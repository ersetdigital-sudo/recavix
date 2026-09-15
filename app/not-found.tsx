import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="py-6">
          <div className="card-shadow rounded-2xl border border-mint-2 bg-white px-6 py-16 text-center">
            <div aria-hidden className="mb-3 text-5xl">
              🎮
            </div>
            <h1 className="text-[26px] font-extrabold">
              Halaman tidak ditemukan
            </h1>
            <p className="mx-auto mt-2 max-w-[420px] text-sm opacity-75">
              Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk
              kembali dan pilih game favoritmu.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-green-d px-6 py-2.5 font-semibold text-white transition-colors hover:bg-green-dd"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/games"
                className="rounded-xl border-2 border-green-d px-6 py-2.5 font-semibold transition-colors hover:bg-mint"
              >
                Lihat Semua Game
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

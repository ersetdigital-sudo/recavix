/**
 * Tag cache bersama. Setiap admin menyimpan, tag ini ditembak supaya halaman
 * publik yang di-prerender ikut membaca data terbaru.
 */
export const CONTENT_TAG = "recavix-content";

/**
 * Bagian kunci cache yang berganti tiap deployment.
 *
 * Cache `unstable_cache` disimpan di cache data Next.js dan bisa bertahan
 * melewati deploy. Tanpa bagian ini, halaman dinamis masih menyajikan data lama
 * setelah kode baru naik — mis. katalog yang diubah lewat kode, bukan lewat
 * dashboard (yang memang memicu `revalidateTag`).
 *
 * Dengan `VERCEL_DEPLOYMENT_ID` sebagai bagian kunci, tiap deployment selalu
 * mulai dari cache kosong, sementara `revalidateTag` tetap bekerja selama satu
 * deployment berjalan. Di luar Vercel nilainya `local` — cache lokal tetap
 * dibersihkan setiap `.next` dihapus.
 */
export const CACHE_EPOCH =
  process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local";

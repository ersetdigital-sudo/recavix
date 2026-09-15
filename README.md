# Recavix 🎮

**Top up diamond, gems & voucher game — harga termurah, proses otomatis 24 jam.**

Platform top-up game untuk pasar Indonesia. Katalog 28 game populer, alur checkout 4 langkah,
kalkulator promo, dan pelacak status transaksi — semuanya dibangun sebagai web app modern
dengan Next.js App Router, animasi halus, dan SEO teknis yang lengkap.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?logo=framer&logoColor=white)](https://motion.dev)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)

<img src="preview/preview-desktop-1440-home.png" alt="Halaman beranda Recavix — carousel promo, filter kategori, dan grid game" width="100%">

---

## ✨ Fitur

- **Katalog 28 game** — Mobile Legends, Genshin Impact, PUBG Mobile, Free Fire, Dota 2,
  Honkai Star Rail, dan lainnya; terbagi dalam **7 kategori** dan **6 platform**.
- **Pencarian & filter real-time** — cari berdasarkan nama, saring dengan kombinasi
  kategori + platform secara bersamaan, lengkap dengan hitungan hasil dan empty state.
- **Carousel promo otomatis** — 4 slide banner yang berganti tiap 3,5 detik, berhenti
  saat di-hover/focus, bisa dikontrol manual lewat tombol prev/next dan dot.
- **Alur checkout 4 langkah** — isi data akun (User ID + Zone ID) → pilih nominal →
  pilih metode pembayaran → kontak & kode promo, dengan ringkasan pesanan *sticky*.
- **14 nominal diamond** (Rp 1.500 – Rp 520.000) dengan badge **HEMAT / POPULER / BEST VALUE**.
- **6 metode pembayaran** — QRIS, GoPay, DANA, OVO, ShopeePay, dan Transfer Bank BCA.
- **Kode promo berfungsi** — `GEMS10` (diskon 10%) dan `NEWBIE5` (diskon 5%), divalidasi
  langsung di sisi klien dan otomatis menghitung ulang total.
- **Pelacak transaksi** — masukkan Invoice ID untuk melihat status (berhasil / pending /
  gagal), rincian pesanan, dan timeline riwayat status.
- **Checkout via WhatsApp** — pesanan dirangkum otomatis menjadi deep link `wa.me`
  berisi detail lengkap, siap dikirim untuk konfirmasi.
- **SEO teknis lengkap** — metadata per halaman, canonical, Open Graph, Twitter Card,
  6 tipe JSON-LD, `sitemap.xml`, `robots.txt`, dan URL bersih.
- **Fully responsive** — diuji dari mobile 390px sampai ultra-wide 2560px.
- **Aksesibilitas** — landmark semantik, satu `<h1>` per halaman, skip-link, `aria-label`,
  `aria-live` untuk hasil pencarian transaksi, dan menghormati `prefers-reduced-motion`.

---

## 🧱 Tech Stack

| Lapisan | Teknologi |
| --- | --- |
| Framework | Next.js **15.5** (App Router, React Server Components) |
| UI | React **19**, Framer Motion **13** |
| Bahasa | TypeScript **5.7** (`strict: true`, alias `@/*`) |
| Styling | Tailwind CSS **4** — design token via `@theme` di `app/globals.css`, tanpa `tailwind.config.js` |
| Font | `next/font/local` — self-hosted **Rubik** (400–700) & **Baloo 2** (600–800), zero layout shift |
| SEO | Metadata API + JSON-LD (`schema.org`) |
| Linting | ESLint **9** + `eslint-config-next` |
| Image | `next/image` dengan format AVIF & WebP |

---

## 🗺️ Halaman

| Route | Deskripsi |
| --- | --- |
| `/` | Beranda — carousel promo, filter kategori/platform, grid game, testimoni, FAQ. JSON-LD `FAQPage`. |
| `/topup` | Checkout — alur 4 langkah dengan ringkasan pesanan sticky. JSON-LD `Product` + `BreadcrumbList`. |
| `/games` | Katalog lengkap — pencarian teks + sidebar filter. Server component yang membaca `?q=` dari `searchParams`. JSON-LD `ItemList` + `BreadcrumbList`. |
| `/cek-transaksi` | Pelacak status pesanan berdasarkan Invoice ID. JSON-LD `BreadcrumbList`. |
| `*` | Halaman 404 kustom dengan CTA kembali ke beranda / katalog. |

**Contoh data untuk dicoba:** Invoice ID `TG-2026-0001` (berhasil), `TG-2026-0002` (pending),
`TG-2026-0003` (gagal). Kode promo: `GEMS10`, `NEWBIE5`.

---

## 📁 Struktur Project

```
recavix/
├─ app/                        # App Router
│  ├─ page.tsx                 #   /
│  ├─ topup/page.tsx           #   /topup
│  ├─ games/page.tsx           #   /games (async — baca ?q= dari searchParams)
│  ├─ cek-transaksi/page.tsx   #   /cek-transaksi
│  ├─ layout.tsx               #   metadata global + JSON-LD Organization & WebSite
│  ├─ not-found.tsx            #   404
│  ├─ robots.ts                #   robots.txt
│  ├─ sitemap.ts               #   sitemap.xml
│  └─ globals.css              #   design token Tailwind v4 (@theme)
├─ components/
│  ├─ layout/                  #   Header, Footer, Container, Breadcrumbs, SiteShell
│  ├─ home/                    #   HomeExplorer, HeroCarousel, FaqAccordion, Testimonials
│  ├─ games/                   #   GamesExplorer — pencarian + filter
│  ├─ topup/                   #   TopupFlow + DiamondPackGrid, PaymentMethodGrid, OrderSummary, ...
│  ├─ transactions/            #   TransactionChecker + Detail, Timeline, NotFound
│  ├─ seo/                     #   JsonLd
│  └─ ui/                      #   GameCard, SectionCard, Reveal, StarRating, FilterRow, ...
├─ data/                       # Sumber data statis (ditulis sebagai modul TypeScript)
├─ lib/                        # cn, collections, format, media, fonts, seo
├─ types/                      # Tipe domain
├─ public/                     # fonts/, icons/, images/
└─ preview/                    # Screenshot dokumentasi
```

---

## 🚀 Menjalankan

```bash
# 1. Install dependency
npm install

# 2. Jalankan dev server
npm run dev
# → http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi
npm run start      # jalankan hasil build
npm run lint       # ESLint
npm run typecheck  # TypeScript tanpa emit
```

### Konfigurasi

Satu environment variable opsional:

| Variabel | Default | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://recavix.net` | Basis URL absolut untuk canonical, Open Graph, sitemap, dan JSON-LD. |

> **Catatan penting:** pastikan `NODE_ENV` **tidak** di-set ke `production` secara global di
> shell kamu. `next dev` wajib berjalan di mode `development` — kalau tidak, semua halaman
> akan mengembalikan `500 Internal Server Error`.

---

## 🧠 Catatan Arsitektur

Project ini **sepenuhnya client-side dan tanpa backend**. Tidak ada API route, server action,
middleware, maupun pemanggilan `fetch` ke layanan eksternal.

- Seluruh data berasal dari modul statis di `data/` (game, paket diamond, metode bayar,
  promo, FAQ, testimoni, slide hero) sehingga halaman bisa di-prerender penuh.
- Semua permukaan interaktif (`Header`, `HeroCarousel`, `GamesExplorer`, `TopupFlow`,
  `TransactionChecker`, dst.) adalah komponen `"use client"` yang dikendalikan `useState`.
- Satu-satunya perilaku server dinamis ada di `app/games/page.tsx`, yang `await` `searchParams`
  untuk mengisi query pencarian dari header beranda.
- **Pembuatan pesanan belum terhubung ke payment gateway.** Validasi form murni di sisi klien,
  lalu pembeli diarahkan ke deep link WhatsApp dengan ringkasan pesanan untuk konfirmasi manual.
- **Data transaksi masih dataset demo** (`data/transactions.ts`) yang di-key berdasarkan
  Invoice ID, ditandai TODO untuk diganti dengan pencarian ke backend sungguhan.

---

## 🔍 SEO

- `createMetadata()` di `lib/seo.ts` menyusun `title`, `description`, `canonical`,
  Open Graph, dan Twitter Card secara konsisten untuk setiap halaman.
- JSON-LD terkirim di HTML awal lewat `components/seo/JsonLd.tsx`:
  **Organization**, **WebSite** (+ SearchAction), **FAQPage**, **ItemList** (katalog `VideoGame`),
  **Product** (dengan `AggregateOffer` IDR), dan **BreadcrumbList**.
- `app/robots.ts` dan `app/sitemap.ts` men-generate `robots.txt` serta `sitemap.xml`
  dengan prioritas dan `changeFrequency` per halaman.

---

## 📸 Galeri

**Desktop**

| Beranda | Katalog Game |
| --- | --- |
| <img src="preview/preview-desktop-1440-home.png" alt="Beranda Recavix di desktop" width="100%"> | <img src="preview/preview-desktop-1440-games.png" alt="Katalog game Recavix di desktop" width="100%"> |

| Checkout Top Up | Cek Transaksi |
| --- | --- |
| <img src="preview/preview-desktop-1440-topup.png" alt="Halaman checkout top up Recavix" width="100%"> | <img src="preview/preview-desktop-1440-cek.png" alt="Halaman cek transaksi Recavix" width="100%"> |

**Responsive** — mobile 390px · tablet 820px · ultra-wide 2560px

| Mobile | Tablet | Ultra-wide |
| --- | --- | --- |
| <img src="preview/preview-mobile-390-home.png" alt="Beranda Recavix di mobile 390px" width="100%"> | <img src="preview/preview-tablet-820-home.png" alt="Beranda Recavix di tablet 820px" width="100%"> | <img src="preview/preview-ultra-wide-2560-home.png" alt="Beranda Recavix di ultra-wide 2560px" width="100%"> |

---

## 🗺️ Roadmap

- [ ] Integrasi payment gateway (QRIS / e-wallet) menggantikan konfirmasi manual via WhatsApp.
- [ ] Backend order & lookup transaksi sungguhan, menggantikan dataset demo.
- [ ] Autentikasi pengguna (tombol Log In / Sign Up saat ini masih placeholder).
- [ ] Riwayat pesanan per akun.
- [ ] Test otomatis (unit + E2E).

---

## 👤 Author

**ersetdigital-sudo**

- GitHub: [@ersetdigital-sudo](https://github.com/ersetdigital-sudo)
- Repository: [github.com/ersetdigital-sudo/recavix](https://github.com/ersetdigital-sudo/recavix)

---

## 📄 Lisensi

Belum ada lisensi eksplisit untuk project ini. Semua hak dilindungi pemiliknya —
hubungi author jika ingin menggunakannya.

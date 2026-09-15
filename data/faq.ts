import type { FaqItem } from "@/types";

/**
 * FAQ drives both the on-page accordion and the FAQPage JSON-LD.
 * TODO(maintainer): review wording / tambah pertanyaan sesuai kebijakan toko.
 */
export const faqItems: FaqItem[] = [
  {
    question: "Berapa lama proses top up di Recavix?",
    answer:
      "Proses berjalan otomatis 24 jam. Setelah pembayaran terkonfirmasi, diamond atau item biasanya masuk ke akun dalam 1–5 menit.",
  },
  {
    question: "Apa saja metode pembayaran yang tersedia?",
    answer:
      "Kami menerima QRIS (semua e-wallet), GoPay, DANA, OVO, ShopeePay, dan transfer bank BCA.",
  },
  {
    question: "Di mana saya bisa melihat User ID dan Zone ID?",
    answer:
      "User ID dan Zone ID bisa dilihat di menu profil di dalam game. Pastikan datanya benar agar item tidak salah kirim.",
  },
  {
    question: "Bagaimana cara melacak pesanan saya?",
    answer:
      "Setelah checkout, kami kirim Invoice ID lewat WhatsApp atau email. Masukkan Invoice ID tersebut di halaman Cek Transaksi untuk melihat status pesanan.",
  },
  {
    question: "Apakah ada kode promo?",
    answer:
      "Ya. Saat ini tersedia kode GEMS10 untuk diskon 10% dan NEWBIE5 untuk diskon 5%. Masukkan kode di langkah pembayaran.",
  },
  {
    question: "Apa yang harus dilakukan kalau pesanan gagal?",
    answer:
      "Jika transaksi gagal, dana otomatis dikembalikan. Kamu juga bisa menghubungi CS kami lewat email halo@recavix.net untuk bantuan lebih lanjut.",
  },
];

"use client";

import { useEffect, useState } from "react";

/** Batas waktu pembayaran, dihitung dari waktu pesanan dibuat. */
const WINDOW_MINUTES = 15;

function remainingMs(createdAt: string) {
  const deadline = new Date(createdAt).getTime() + WINDOW_MINUTES * 60_000;
  return Math.max(0, deadline - Date.now());
}

function format(ms: number) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Hitung mundur pembayaran.
 *
 * Nilai awalnya sengaja `null` supaya render pertama di server dan di klien
 * sama-sama kosong — kalau dihitung saat render, jam server dan jam browser
 * bisa berbeda satu detik dan memicu hydration mismatch.
 */
export function PaymentCountdown({ createdAt }: { createdAt: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(remainingMs(createdAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [createdAt]);

  if (remaining === null) {
    return <span className="text-xs opacity-60">Menghitung sisa waktu…</span>;
  }

  if (remaining <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-line bg-peach-2 px-3 py-1 text-xs font-bold text-coral-dark">
        ⏰ Waktu pembayaran habis
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#e8c98f] bg-[#fdeccb] px-3 py-1 text-xs font-bold text-[#96692a]">
      ⏳ Bayar dalam <span className="tabular-nums">{format(remaining)}</span>
    </span>
  );
}

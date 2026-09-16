"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger helper — seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
}

/** Jarak aman dari tepi bawah viewport sebelum animasi dipicu. */
const TRIGGER_MARGIN = 60;

/**
 * Fade + slide-in saat masuk viewport.
 *
 * HTML dari server sengaja **tidak** memuat `opacity: 0`. Dulu `initial` dari
 * framer-motion ikut ter-render di server, dan itu membuat isinya tersembunyi
 * permanen begitu JavaScript tidak jalan atau pengguna menyalakan
 * "reduce motion" — di beranda, grid game dan testimoni jadi terlihat kosong
 * padahal elemennya ada.
 *
 * Sekarang keadaan tersembunyi hanya dipasang setelah komponen hidup di browser,
 * dan hanya untuk elemen yang memang masih di bawah viewport:
 *
 * - tanpa JavaScript → konten langsung terlihat
 * - reduce motion    → konten langsung terlihat, tanpa animasi
 * - normal           → elemen yang muncul saat di-scroll tetap dianimasikan
 */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Elemen yang sudah terlihat sejak awal tidak perlu animasi masuk.
    if (element.getBoundingClientRect().top < window.innerHeight - TRIGGER_MARGIN) return;

    setAnimate(true);
  }, []);

  if (!animate || reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: `-${TRIGGER_MARGIN}px` }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

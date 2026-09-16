"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { HERO_BANNER_ASPECT, HERO_BANNER_SIZES } from "@/lib/media";
import type { HeroSlide } from "@/types";

const AUTOPLAY_MS = 3500;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

interface HeroCarouselProps {
  /** Slide banner aktif, berasal dari dashboard. */
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const count = slides.length;
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback(
    (step: number) => {
      if (count === 0) return;
      setSlide(([current]) => [(current + step + count) % count, step]);
    },
    [count],
  );

  useEffect(() => {
    // Tanpa slide, tidak ada yang bisa diputar — dan modulo 0 menghasilkan NaN.
    if (paused || count === 0) return;
    const timer = setInterval(() => {
      setSlide(([current]) => [(current + 1) % count, 1]);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const activeSlide = slides[index];

  if (!activeSlide) return null;

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Promo"
        className="card-shadow group relative overflow-hidden rounded-2xl border-2 border-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Inner box carries the exact artwork ratio and has no border, so the
            illustration is neither cropped nor letterboxed inside the frame.
            Every slide shares this ratio. */}
        <div className={cn("relative", HERO_BANNER_ASPECT)}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${count}`}
            >
              <Link href={activeSlide.href} className="block h-full w-full">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  fill
                  priority={index === 0}
                  sizes={HERO_BANNER_SIZES}
                  className="object-contain object-center"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <>
              <CarouselButton side="prev" onClick={() => paginate(-1)} />
              <CarouselButton side="next" onClick={() => paginate(1)} />
            </>
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <div className="flex justify-center gap-2 py-3">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setSlide([dotIndex, dotIndex > index ? 1 : -1])}
              aria-label={`Ke slide ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={cn(
                "h-[9px] rounded-full transition-all duration-300",
                dotIndex === index ? "w-[22px] bg-green" : "w-[9px] bg-[#cbd8c6]",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CarouselButton({
  side,
  onClick,
}: {
  side: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = side === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Promo sebelumnya" : "Promo berikutnya"}
      className={cn(
        "absolute top-1/2 grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-green-d shadow-[0_2px_8px_rgba(60,90,55,0.25)] transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
        isPrev ? "left-2" : "right-2",
      )}
    >
      <span aria-hidden className="text-sm font-extrabold">
        {isPrev ? "‹" : "›"}
      </span>
    </button>
  );
}

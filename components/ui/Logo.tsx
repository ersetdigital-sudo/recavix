import Link from "next/link";

import { cn } from "@/lib/cn";

interface LogoProps {
  /** Nama brand yang sedang aktif — berasal dari dashboard, bukan dari kode. */
  name: string;
  className?: string;
  /** Mark only, no wordmark — used where space is tight. */
  markOnly?: boolean;
  /** Square size of the mark in px. */
  size?: number;
}

/**
 * "Letter R" lettermark: a geometric R on a gradient squircle.
 * Drawn inline as SVG so it stays crisp from 16px favicons up to hero sizes.
 */
export function LogoMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#recavix-mark)"
      />
      <path
        d="M23 48V16h13.5a9.5 9.5 0 0 1 0 19H23"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 35l10 13"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ name, className, markOnly = false, size = 30 }: LogoProps) {
  // Dua huruf terakhir diberi warna aksen; sisanya warna brand.
  const head = name.length > 2 ? name.slice(0, -2) : "";
  const tail = name.length > 2 ? name.slice(-2) : name;

  return (
    <Link
      href="/"
      aria-label={`${name} — beranda`}
      className={cn("flex flex-none items-center gap-2", className)}
    >
      <LogoMark size={size} />
      {!markOnly && (
        <span className="font-display text-[21px] font-extrabold leading-none text-green-d">
          {head}
          <span className="text-green">{tail}</span>
        </span>
      )}
    </Link>
  );
}

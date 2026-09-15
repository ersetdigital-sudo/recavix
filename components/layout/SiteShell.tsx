import type { ReactNode } from "react";

/**
 * Full-bleed page background. Section backgrounds (header, footer, cards)
 * stretch to the viewport; the content inside each one is constrained by
 * `<Container />` instead.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid-bg flex min-h-screen flex-col">
      {/* Gradient definition consumed by every <LogoMark /> on the page. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute h-0 w-0 overflow-hidden"
      >
        <defs>
          <linearGradient
            id="recavix-mark"
            x1="6"
            y1="4"
            x2="58"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#3f8a53" />
            <stop offset="0.55" stopColor="#2f6b41" />
            <stop offset="1" stopColor="#1d4529" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </div>
  );
}

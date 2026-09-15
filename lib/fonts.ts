import localFont from "next/font/local";

/**
 * Fonts are self-hosted from `public/fonts` and loaded through `next/font`
 * so they get preloaded, subsetted and served with zero layout shift.
 * Only the weights actually used by the UI are referenced.
 */
export const rubik = localFont({
  src: [
    { path: "../public/fonts/rubik-regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/rubik-medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/rubik-semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/rubik-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-rubik",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const baloo = localFont({
  src: [
    { path: "../public/fonts/baloo2-wght--semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/baloo2-wght--bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/baloo2-wght--extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-baloo",
  display: "swap",
  fallback: ["system-ui", "cursive"],
});

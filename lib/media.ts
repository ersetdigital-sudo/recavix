/**
 * Native dimensions of every promo/banner artwork in `public/images/hero`.
 * All four files are 1584×672 (2.36:1).
 *
 * These banners are wide scene illustrations — cropping them to a short strip
 * cuts off most of the artwork (the subject sits in the right-hand 60%), so
 * they are always rendered at this ratio and never with a forced pixel height.
 */
export const HERO_BANNER_WIDTH = 1584;
export const HERO_BANNER_HEIGHT = 672;

/** Tailwind aspect-ratio utility matching the banner artwork. */
export const HERO_BANNER_ASPECT = "aspect-[1584/672]";

/** `sizes` hint for next/image, matching the widest content container. */
export const HERO_BANNER_SIZES = "(max-width: 1440px) 100vw, 1440px";

/**
 * Ikon pengganti untuk game yang belum punya gambarnya sendiri — mis. game baru
 * yang ditambahkan dari dashboard sebelum ikonnya diunggah.
 */
export const GAME_IMAGE_FALLBACK = "/icons/icon-192.png";

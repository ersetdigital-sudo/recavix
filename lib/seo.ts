import type { Metadata } from "next";

import { SITE_LANG, SITE_LOCALE, SITE_ORIGIN } from "@/lib/content/defaults";
import type { FaqItem, Game, NavItem, SiteSettings } from "@/types";

const DEFAULT_OG_IMAGE = "/images/hero/promo-cashback-70.png";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute-in-app path, e.g. `/games`. */
  path: string;
  image?: string;
  /** Nama brand yang sedang aktif — berasal dari dashboard, bukan dari kode. */
  siteName: string;
  /**
   * Judul yang sudah memuat nama brand sendiri. Tanpa ini, template judul dari
   * root layout menempelkan nama brand untuk kedua kalinya.
   */
  absoluteTitle?: boolean;
}

/** Builds consistent per-page metadata (canonical, OG, Twitter). */
export function createMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  siteName,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, SITE_ORIGIN).toString();

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url,
      siteName,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

type JsonLdObject = Record<string, unknown>;

const withContext = (data: JsonLdObject): JsonLdObject => ({
  "@context": "https://schema.org",
  ...data,
});

export const organizationJsonLd = (settings: SiteSettings): JsonLdObject =>
  withContext({
    "@type": "Organization",
    name: settings.name,
    url: SITE_ORIGIN,
    email: settings.contact.email,
    description: settings.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: settings.contact.email,
      telephone: `+${settings.contact.whatsapp}`,
      areaServed: "ID",
      availableLanguage: ["id"],
    },
  });

export const websiteJsonLd = (settings: SiteSettings): JsonLdObject =>
  withContext({
    "@type": "WebSite",
    name: settings.name,
    url: SITE_ORIGIN,
    inLanguage: SITE_LANG,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/games?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

export const breadcrumbJsonLd = (items: NavItem[]): JsonLdObject =>
  withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, SITE_ORIGIN).toString(),
    })),
  });

export const faqJsonLd = (items: FaqItem[]): JsonLdObject =>
  withContext({
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });

export const gameListJsonLd = (list: Game[], siteName: string): JsonLdObject =>
  withContext({
    "@type": "ItemList",
    name: `Katalog Game ${siteName}`,
    numberOfItems: list.length,
    itemListElement: list.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoGame",
        name: game.name,
        image: new URL(game.image, SITE_ORIGIN).toString(),
        genre: game.category,
        gamePlatform: game.platform,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: game.rating,
          bestRating: 5,
          ratingCount: 120,
        },
      },
    })),
  });

interface ProductJsonLdInput {
  name: string;
  description: string;
  path: string;
  image: string;
  lowPrice: number;
  highPrice: number;
  /** Jumlah paket yang ditawarkan — ikut katalog, bukan angka tetap. */
  offerCount: number;
  siteName: string;
}

export const productJsonLd = ({
  name,
  description,
  path,
  image,
  lowPrice,
  highPrice,
  offerCount,
  siteName,
}: ProductJsonLdInput): JsonLdObject =>
  withContext({
    "@type": "Product",
    name,
    description,
    image: new URL(image, SITE_ORIGIN).toString(),
    brand: { "@type": "Brand", name: siteName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice,
      highPrice,
      offerCount,
      availability: "https://schema.org/InStock",
      url: new URL(path, SITE_ORIGIN).toString(),
    },
  });

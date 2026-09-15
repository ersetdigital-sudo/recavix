import type { Metadata } from "next";

import { faqItems } from "@/data/faq";
import { games } from "@/data/games";
import { site } from "@/data/site";
import type { Game, NavItem } from "@/types";

const DEFAULT_OG_IMAGE = "/images/hero/promo-cashback-70.png";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute-in-app path, e.g. `/games`. */
  path: string;
  image?: string;
}

/** Builds consistent per-page metadata (canonical, OG, Twitter). */
export function createMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
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

export const organizationJsonLd = (): JsonLdObject =>
  withContext({
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.contact.email,
    description: site.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.contact.email,
      telephone: `+${site.contact.whatsapp}`,
      areaServed: "ID",
      availableLanguage: ["id"],
    },
  });

export const websiteJsonLd = (): JsonLdObject =>
  withContext({
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.lang,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/games?q={search_term_string}`,
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
      item: new URL(item.href, site.url).toString(),
    })),
  });

export const faqJsonLd = (): JsonLdObject =>
  withContext({
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });

export const gameListJsonLd = (list: Game[] = games): JsonLdObject =>
  withContext({
    "@type": "ItemList",
    name: "Katalog Game Recavix",
    numberOfItems: list.length,
    itemListElement: list.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoGame",
        name: game.name,
        image: new URL(game.image, site.url).toString(),
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
}

export const productJsonLd = ({
  name,
  description,
  path,
  image,
  lowPrice,
  highPrice,
}: ProductJsonLdInput): JsonLdObject =>
  withContext({
    "@type": "Product",
    name,
    description,
    image: new URL(image, site.url).toString(),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice,
      highPrice,
      offerCount: 14,
      availability: "https://schema.org/InStock",
      url: new URL(path, site.url).toString(),
    },
  });

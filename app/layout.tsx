import type { Metadata, Viewport } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { baloo, rubik } from "@/lib/fonts";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  category: "games",
  keywords: [
    "top up game",
    "top up diamond",
    "top up murah",
    "voucher game",
    "top up mobile legends",
    "top up genshin impact",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#cfe0c8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang} className={`${rubik.variable} ${baloo.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-green-d focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Lewati ke konten
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";

import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/lib/content/store";
import { baloo, rubik } from "@/lib/fonts";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.name}`,
    },
    description: settings.description,
    applicationName: settings.name,
    category: "games",
    keywords: [
      "top up game",
      "top up diamond",
      "top up murah",
      "voucher game",
      "top up mobile legends",
      "top up genshin impact",
      settings.name,
    ],
    authors: [{ name: settings.name }],
    creator: settings.name,
    publisher: settings.name,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: settings.locale,
      siteName: settings.name,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#cfe0c8",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getSiteContent();

  return (
    <html lang={settings.lang} className={`${rubik.variable} ${baloo.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd(settings)} />
        <JsonLd data={websiteJsonLd(settings)} />
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

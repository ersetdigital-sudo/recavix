import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/content/defaults";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
}

const routes: RouteConfig[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/topup", priority: 0.9, changeFrequency: "weekly" },
  { path: "/games", priority: 0.9, changeFrequency: "weekly" },
  { path: "/cek-transaksi", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, SITE_ORIGIN).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

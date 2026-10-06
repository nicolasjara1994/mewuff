import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/personaliza", priority: 0.9, changeFrequency: "monthly" },
  { path: "/como-funciona", priority: 0.8, changeFrequency: "monthly" },
  { path: "/galeria", priority: 0.8, changeFrequency: "weekly" },
  { path: "/preguntas-frecuentes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

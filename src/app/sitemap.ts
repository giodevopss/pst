import type { MetadataRoute } from "next";
import { PRODUTOS } from "@/data/produtos";
import { resolvePublicSiteOrigin } from "@/lib/public-site";

const BASE = resolvePublicSiteOrigin();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/album", "/camisetas", "/pacotes", "/sobre", "/checkout"];

  const camisetas = PRODUTOS.filter((p) => p.categoria === "camiseta").map((p) => ({
    url: `${BASE}/camisetas/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const outros = PRODUTOS.filter((p) => p.categoria !== "camiseta").map((p) => ({
    url: `${BASE}/produto/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPaths.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.9,
    })),
    ...camisetas,
    ...outros,
  ];
}

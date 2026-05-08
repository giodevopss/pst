import type { MetadataRoute } from "next";
import { resolvePublicSiteOrigin } from "@/lib/public-site";

const BASE = resolvePublicSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/checkout", "/pedido"] }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

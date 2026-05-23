import { resolvePublicSiteOrigin } from "@/lib/public-site";

/** Origin da requisição atual (domínio customizado) ou NEXT_PUBLIC_SITE_URL. */
export function resolveRequestSiteOrigin(req: Request): string {
  const hostRaw = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = (req.headers.get("x-forwarded-proto") ?? "https").split(",")[0]?.trim() || "https";
  if (hostRaw) {
    const host = hostRaw.split(",")[0]?.trim();
    if (host && !host.includes("localhost")) {
      try {
        return new URL(`${proto}://${host}`).origin;
      } catch {
        /* fallthrough */
      }
    }
  }
  return resolvePublicSiteOrigin();
}

export function buildMercadoPagoNotificationUrl(req: Request): string | undefined {
  const origin = resolveRequestSiteOrigin(req);
  if (!origin || origin.includes("localhost")) return undefined;
  return `${origin.replace(/\/$/, "")}/api/mercadopago/webhook`;
}

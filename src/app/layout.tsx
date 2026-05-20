import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { publicMetadataBase } from "@/lib/public-site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { TickerBar } from "@/components/TickerBar";
import { PartnershipRibbon } from "@/components/PartnershipRibbon";
import { PromoModal } from "@/components/PromoModal";
import { MetaPixelRoot } from "@/components/MetaPixelRoot";
import { getMetaPixelId } from "@/lib/meta-pixel";
import { AttributionCaptureRoot } from "@/components/AttributionCaptureRoot";
import { ThemeInitScript } from "@/components/ThemeInitScript";
import { ThemeColorMeta } from "@/components/ThemeColorMeta";
import { SITE_LOGO } from "@/config/brand";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: publicMetadataBase(),
  title: {
    default: "Copa 2026 Store — Álbum oficial e camisetas das seleções",
    template: "%s | Copa 2026 Store",
  },
  description:
    "Loja Copa 2026 em parceria com a Panini: mesmos lançamentos da coleção FIFA World Cup 2026™ — álbum, envelopes, boxes e Adrenalyn XL™, além da camisa do Brasil.",
  keywords: [
    "Copa 2026",
    "álbum copa 2026",
    "figurinhas copa 2026",
    "camisetas seleção",
    "Brasil 2026",
    "Panini",
  ],
  openGraph: {
    title: "Copa 2026 Store",
    description:
      "Parceria Panini FIFA World Cup 2026™: álbum, envelopes, boxes, Adrenalyn XL™ e camisa do Brasil.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copa 2026 Store",
    description:
      "Parceria Panini FIFA World Cup 2026™: álbum oficial, coleção Adrenalyn XL™ e Brasil na Copa.",
  },
  icons: {
    icon: [{ url: SITE_LOGO.src, type: "image/png" }],
    apple: [{ url: SITE_LOGO.src, type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#06080f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelId = getMetaPixelId();

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeInitScript />
        <ThemeColorMeta />
        <CartProvider>
          <AttributionCaptureRoot />
          {metaPixelId ? <MetaPixelRoot pixelId={metaPixelId} /> : null}
          <PartnershipRibbon />
          <TickerBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <PromoModal />
        </CartProvider>
      </body>
    </html>
  );
}

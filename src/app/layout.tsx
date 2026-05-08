import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { TickerBar } from "@/components/TickerBar";
import { PartnershipRibbon } from "@/components/PartnershipRibbon";
import { PromoModal } from "@/components/PromoModal";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://copa2026.store"),
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
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85, 88, 90, 92, 95, 100],
    deviceSizes: [640, 750, 828, 992, 1080, 1200, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      { source: "/selecoes", destination: "/pacotes", permanent: true },
      {
        source: "/produto/pacote-brasil-camisa-linha-panini",
        destination: "/produto/pacote-brasil-camisa-ouro-12-sobres",
        permanent: true,
      },
      {
        source: "/produto/pacote-brasil-camisa-ouro-36-sobres",
        destination: "/produto/pacote-brasil-camisa-ouro-50-sobres",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

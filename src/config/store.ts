export const STORE_CONFIG = {
  name: "Copa 2026 Store",
  shortName: "Copa 2026",
  tagline: "FIFA World Cup 2026™ com a Panini — e o Brasil na coleção",

  pix: {
    key: "pix@copa2026.store",
    keyType: "E-mail",
    receiver: "Copa 2026 Store LTDA",
    city: "São Paulo",
  },

  shipping: {
    note: "Frete grátis para todo o Brasil. Enviamos pelos Correios e transportadoras parceiras.",
  },

  social: {
    instagram: "https://instagram.com/copa2026.store",
    tiktok: "https://tiktok.com/@copa2026.store",
  },

  /** Contato oficial de suporte Panini */
  email: "suporte@panini.com.br",

  worldCup: {
    startDate: "2026-06-11T00:00:00-03:00",
    name: "Copa do Mundo FIFA 2026",
    hosts: ["Estados Unidos", "México", "Canadá"],
  },
} as const;

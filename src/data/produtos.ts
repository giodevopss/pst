import { getSelecao } from "./selecoes";
import { PACOTES_PAGINA_DESTAQUE_IDS } from "@/lib/store-pricing";

export type Tamanho = "P" | "M" | "G" | "GG" | "XGG";
export type ProdutoCategoria = "album" | "camiseta" | "pacote";

export type Produto = {
  id: string;
  slug: string;
  nome: string;
  categoria: ProdutoCategoria;
  preco: number;
  precoOriginal?: number;
  selecaoSlug?: string;
  /** Caminho em /public para imagem do produto (ex: /images/album.png) */
  imagemSrc?: string;
  /** Galeria na página da camisa (anúncio + fotos extras) */
  galeria?: string[];
  descricao: string;
  destaques: string[];
  tamanhos?: Tamanho[];
  estoque: "em_estoque" | "ultimas_unidades";
  badge?: string;
};

export const TAMANHOS: Tamanho[] = ["P", "M", "G", "GG", "XGG"];

/** Fotos adicionais (referência) — Camiseta I. */
const CAMISETA_BRASIL_I_REFERENCIA = Array.from(
  { length: 12 },
  (_, i) => `/images/camisetas/brasil-i/${String(i + 1).padStart(2, "0")}.webp`,
);
/** Fotos adicionais (referência) — Camiseta II. */
const CAMISETA_BRASIL_II_REFERENCIA = Array.from(
  { length: 9 },
  (_, i) => `/images/camisetas/brasil-ii/${String(i + 1).padStart(2, "0")}.webp`,
);
/** Anúncio original + fotos de referência na página da camisa. */
const GALERIA_ANUNCIO_CAMISETA_BRASIL_I = [
  "/images/camiseta-brasil.jpg",
  ...CAMISETA_BRASIL_I_REFERENCIA,
];
const GALERIA_ANUNCIO_CAMISETA_BRASIL_II = [
  "/images/camiseta-brasil-ii.png",
  ...CAMISETA_BRASIL_II_REFERENCIA,
];

const brasil = getSelecao("brasil");

if (!brasil) {
  throw new Error("Seleção Brasil não encontrada nos dados.");
}

/**
 * Catálogo alinhado à categoria oficial Panini Brasil — FIFA World Cup 2026™
 * https://panini.com.br/colecionaveis/fifa-world-cup-2026
 * Imagens de produto FIFA 2026: arquivos em /public/images/panini/ espelham o catálogo
 * público Panini (og:image das páginas de produto, uso conforme sua licença).
 * Camisetas Brasil: imagem principal do anúncio (jpg/png) + galeria com referências em /images/camisetas/.
 */
export const PRODUTOS: Produto[] = [
  {
    id: "album-capa-cartao-mais-12-envelopes",
    slug: "album-fifa-world-cup-2026-capa-cartao-mais-12-envelopes",
    nome: "Copa 2026 — Álbum Capa Cartão + 12 Envelopes — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-cartao-mais-12-envelopes.png",
    preco: 108.9,
    descricao:
      "Combo oficial para iniciar a coleção: álbum versão capa cartão mais 12 envelopes de figurinhas da Copa do Mundo FIFA 2026™.",
    destaques: ["Lançamento oficial Panini", "Álbum capa cartão + 12 envelopes", "7 figurinhas por envelope"],
    estoque: "em_estoque",
  },
  {
    id: "box-sacola-cartao-mais-30-envelopes",
    slug: "copa-2026-box-sacola-album-capa-cartao-mais-30-envelopes",
    nome: "Copa 2026 — BOX Sacola — Álbum Capa Cartão + 30 Envelopes — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/box-sacola-cartao-mais-30-envelopes.jpg",
    preco: 234.9,
    descricao:
      "Box em formato sacola com álbum capa cartão e 30 envelopes — volume forte para escalar a coleção.",
    destaques: ["Formato BOX Sacola", "30 envelopes num pacote só", "Foco total na Copa 2026"],
    estoque: "em_estoque",
    badge: "BOX",
  },
  {
    id: "album-capa-cartao-mais-24-envelopes",
    slug: "album-fifa-world-cup-2026-capa-cartao-mais-24-envelopes",
    nome: "Copa 2026 — Álbum Capa Cartão + 24 Envelopes — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-cartao-mais-24-envelopes.png",
    preco: 192.9,
    descricao:
      "Pacote médio oficial: álbum capa cartão e 24 envelopes para avançar rápido nas páginas.",
    destaques: ["24 envelopes no combo", "Entrada ideal para coleção rápida", "Coleção FIFA World Cup 2026™"],
    estoque: "em_estoque",
  },
  {
    id: "album-capa-dura-ouro",
    slug: "album-fifa-world-cup-2026-capa-dura-ouro",
    nome: "Copa 2026 — Álbum Capa Dura Ouro — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-dura-ouro.jpg",
    preco: 79.9,
    descricao:
      "Edição especial capa dura ouro para colecionar a maior Copa com acabamento premium.",
    destaques: ["Capa dura ouro", "112 páginas oficiais", "980 espaços (+ 68 cromos especiais)", "Ícone entre colecionadores"],
    estoque: "em_estoque",
    badge: "Colecionador",
  },
  {
    id: "kit-12-envelopes",
    slug: "copa-2026-kit-com-12-envelopes-fifa-world-cup-2026",
    nome: "Copa 2026 — Kit com 12 Envelopes — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/kit-12-envelopes.jpg",
    preco: 84,
    descricao:
      "Só envelopes: 12 pacotes para repor figurinhas e alimentar trocas com a galera.",
    destaques: ["Reposição rápida", "12 envelopes oficiais", "7 figurinhas em cada pacote"],
    estoque: "em_estoque",
    badge: "Kit",
  },
  {
    id: "envelope-figurinhas-atualizado",
    slug: "copa-2026-pacote-figurinhas-atualizado-fifa-world-cup-2026",
    nome: "Copa 2026 — Pacote de figurinhas atualizado — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/envelope-figurinhas-atualizado.png",
    preco: 7,
    descricao:
      "Pacote oficial atualizado da coleção de figurinhas FIFA World Cup 2026™: 7 cromos por envelope, no padrão Panini — inclui a atualização da seleção brasileira com Neymar Jr.",
    destaques: [
      "7 figurinhas por pacote",
      "Coleção oficial Panini",
      "Pacote atualizado Copa 2026™",
      "Preço promocional na loja",
    ],
    estoque: "em_estoque",
    badge: "Novo",
  },
  {
    id: "box-luva-premium-torcida",
    slug: "copa-2026-box-luva-premium-torcida-ouro-40-envelopes",
    nome:
      "Copa 2026 — BOX Luva Premium Torcida — 1 Álbum Capa Dura Ouro + 40 Envelopes — FIFA WC 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/box-luva-premium-torcida.jpg",
    preco: 359.9,
    descricao:
      "Pacote topo de linha: um álbum capa dura ouro mais 40 envelopes — experiência completa já na largada.",
    destaques: ["Álbum capa dura ouro incluso", "40 envelopes", "BOX premium torcedor"],
    estoque: "ultimas_unidades",
    badge: "Premium",
  },
  {
    id: "album-capa-dura-prata",
    slug: "album-fifa-world-cup-2026-capa-dura-prata",
    nome: "Copa 2026 — Álbum Capa Dura Prata — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-dura-prata.jpg",
    preco: 79.9,
    descricao:
      "Capa dura prata com acabamento diferenciado e o mesmo conteúdo de páginas da edição oficial.",
    destaques: ["Capa dura prata", "Versão oficial intermediária", "980 cromos no álbum"],
    estoque: "em_estoque",
    badge: "Prata",
  },
  {
    id: "album-capa-cartao",
    slug: "album-fifa-world-cup-2026-capa-cartao",
    nome: "Copa 2026 — Álbum Capa Cartão — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-cartao.jpg",
    preco: 24.9,
    descricao:
      "Álbum versão tradicional capa cartão — porta clássica para completar página a página.",
    destaques: ["Versão mais acessível", "Disponível", "Álbum oficial do torneio"],
    estoque: "em_estoque",
    badge: "Entrada",
  },
  {
    id: "album-capa-dura",
    slug: "album-fifa-world-cup-2026-capa-dura",
    nome: "Copa 2026 — Álbum Capa Dura — FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/panini/album-capa-dura.jpg",
    preco: 74.9,
    descricao:
      "Álbum oficial em capa dura padrão (acabamento clássico resistente, sem variante ouro/prata).",
    destaques: ["Capa dura oficial", "Proteção acima da capa cartão", "Álbum Copa 2026"],
    estoque: "em_estoque",
    badge: "Capa dura",
  },
  {
    id: "adrenalyn-xl-starter-pack",
    slug: "fifa-world-cup-2026-adrenalyn-xl-starter-pack",
    nome: "FIFA World Cup 2026™ ADRENALYN XL™ — Starter Pack",
    categoria: "album",
    imagemSrc: "/images/panini/adrenalyn-xl-starter-pack.jpg",
    preco: 149.9,
    descricao:
      "Pacote inicial da coleção oficial de cartas Adrenalyn XL™ inspirada na Copa FIFA 2026™.",
    destaques: ["Linha Adrenalyn XL™ oficial", "Pronto pra jogar e colecionar", "SKU Panini mesmo anúncio"],
    estoque: "em_estoque",
    badge: "Adrenalyn",
  },
  {
    id: "adrenalyn-xl-envelope",
    slug: "fifa-world-cup-2026-adrenalyn-xl-envelope",
    nome: "FIFA World Cup 2026™ ADRENALYN XL™ — Envelope 8 Cards + Cupom",
    categoria: "album",
    imagemSrc: "/images/panini/adrenalyn-xl-envelope.jpg",
    preco: 11.9,
    descricao:
      "Envelope com 8 cartas e cupom — expansão rápida do deck oficial Adrenalyn XL™.",
    destaques: ["8 cards + cupom", "Preço acessível", "Booster oficial"],
    estoque: "em_estoque",
    badge: "Cards",
  },
  {
    id: "adrenalyn-xl-lata-classic-tin",
    slug: "fifa-world-cup-2026-adrenalyn-xl-lata-classic-tin",
    nome: "FIFA World Cup 2026™ ADRENALYN XL™ — Lata Classic Tin",
    categoria: "album",
    imagemSrc: "/images/panini/adrenalyn-xl-lata-classic-tin.jpg",
    preco: 99.9,
    descricao:
      "Latinha colecionável classic tin com seleção especial de cartas da linha Adrenalyn XL™.",
    destaques: ["Lata para display", "Ótimo presente colecionador", "SKU anunciado pela Panini"],
    estoque: "ultimas_unidades",
    badge: "Classic tin",
  },
  {
    id: "lojista-caixa-1000-envelopes",
    slug: "caixa-fechada-1000-envelopes-figurinhas-fifa-world-cup-2026",
    nome: "Caixa fechada — 1000 envelopes figurinhas FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/lojistas/caixa-1000-envelopes-1.png",
    galeria: ["/images/lojistas/caixa-1000-envelopes-2.png"],
    preco: 3500,
    descricao:
      "Caixa master Panini para lojistas: 1000 envelopes oficiais da coleção de figurinhas da Copa do Mundo FIFA 2026™ (7 cromos por envelope). Embalagem fechada para revenda.",
    destaques: [
      "1000 envelopes oficiais",
      "7 figurinhas por envelope",
      "Linha FIFA World Cup 2026™",
      "Condições comerciais para lojistas",
    ],
    estoque: "em_estoque",
    badge: "Lojista · 1000",
  },
  {
    id: "lojista-caixa-100-envelopes",
    slug: "caixa-fechada-100-envelopes-figurinhas-fifa-world-cup-2026",
    nome: "Caixa fechada — 100 envelopes figurinhas FIFA World Cup 2026™",
    categoria: "album",
    imagemSrc: "/images/lojistas/caixa-100-envelopes.png",
    preco: 500,
    descricao:
      "Caixa Panini com 100 envelopes oficiais de figurinhas da Copa do Mundo FIFA 2026™ (7 cromos por envelope). Ideal para lojas de bairro e pontos de revenda.",
    destaques: [
      "100 envelopes oficiais",
      "7 figurinhas por envelope",
      "Panini · Copa 2026™",
      "Pedido mínimo e envio sob consulta",
    ],
    estoque: "em_estoque",
    badge: "Lojista · 100",
  },
  // Pacotes Brasil: camisa + álbum Panini + N pacotes envelopes figurinhas (ref. préço público figurinhas)
  {
    id: "pacote-br-ouro-f12",
    slug: "pacote-brasil-camisa-ouro-12-sobres",
    nome: "Brasil — Camisa + Álbum ouro + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura-ouro.jpg",
    preco: 449.9,
    precoOriginal: 463.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camisa oficial da seleção com o álbum FIFA World Cup 2026™ capa dura ouro Panini e 12 envelopes/pacotes oficiais de figurinhas (7 por envelope, coleção Copa 2026™). Preço combinado frente aos itens avulsos.",
    destaques: ["Camisa Brasil (P a XGG)", "Álbum capa ouro", "12 envelopes figurinhas Copa 2026™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro · 12",
  },
  {
    id: "pacote-br-ouro-f24",
    slug: "pacote-brasil-camisa-ouro-24-sobres",
    nome: "Brasil — Camisa + Álbum ouro + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-cartao-mais-24-envelopes.png",
    preco: 529.9,
    precoOriginal: 547.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Versão intermediária: mesma camisa oficial e álbum ouro Panini FIFA 2026™, com mais volume até a Copa — 24 pacotes envelopes oficiais de figurinha.",
    destaques: ["Camisa oficial Brasil", "Álbum ouro coleção Copa", "24 envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro · 24",
  },
  {
    id: "pacote-br-ouro-f50",
    slug: "pacote-brasil-camisa-ouro-50-sobres",
    nome: "Brasil — Camisa + Álbum ouro + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura-ouro.jpg",
    preco: 699.9,
    precoOriginal: 729.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Pacote forte de colecionar: camisa oficial, álbum capa ouro e 50 pacotes oficial Panini Copa 2026™ — alto volume já na primeira leva antes do Mundial.",
    destaques: ["Camisa oficial", "Álbum ouro símbolo 2026", "50 envelopes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro · 50",
  },
  {
    id: "pacote-br-prata-f12",
    slug: "pacote-brasil-camisa-prata-12-sobres",
    nome: "Brasil — Camisa + Álbum prata + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura-prata.jpg",
    preco: 449.9,
    precoOriginal: 463.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Equipando o mesmo kit da vitrine oficial: camisa Brasil, edição álbum Panini FIFA 2026™ capa prata premium e entrada com 12 pacotes envelopes de figurinhas.",
    destaques: ["Camisa oficial Brasil", "Álbum capa prata oficial", "12 sobres Copa 2026™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · 12",
  },
  {
    id: "pacote-br-prata-f24",
    slug: "pacote-brasil-camisa-prata-24-sobres",
    nome: "Brasil — Camisa + Álbum prata + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura-prata.jpg",
    preco: 529.9,
    precoOriginal: 547.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Um passo à frente no volume das figurinhas (24 pacotes oficial), mantendo a camisa oficial e álbum edição Panini FIFA 2026™ capa prata.",
    destaques: ["Camisa oficial", "Álbum prata", "24 envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · 24",
  },
  {
    id: "pacote-br-prata-f50",
    slug: "pacote-brasil-camisa-prata-50-sobres",
    nome: "Brasil — Camisa + Álbum prata + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura-prata.jpg",
    preco: 699.9,
    precoOriginal: 729.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Colecionista acelerado: camisa oficial Brasil, álbum capa prata Panini Copa 2026™ e 50 pacotes oficiais de figurinha em um mesmo pedido.",
    destaques: ["Camisa oficial", "Álbum prata", "50 envelopes figurinha"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · 50",
  },
  {
    id: "pacote-br-dura-f12",
    slug: "pacote-brasil-camisa-capa-dura-12-sobres",
    nome: "Brasil — Camisa + Álbum capa dura + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura.jpg",
    preco: 439.9,
    precoOriginal: 458.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Ótimo custo‑benefício mantendo resistência ao álbum oficial capa dura (versão Panini Copa 2026™ padrão) com 12 envelopes de figurinhas e sua camisa do Brasil.",
    destaques: ["Camisa Brasil", "Álbum capa dura oficial FIFA 2026™", "12 pacotes figurinha"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Capa dura · 12",
  },
  {
    id: "pacote-br-dura-f24",
    slug: "pacote-brasil-camisa-capa-dura-24-sobres",
    nome: "Brasil — Camisa + Álbum capa dura + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura.jpg",
    preco: 519.9,
    precoOriginal: 542.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camisa oficial + mesmo álbum capa dura padrão da edição Copa 2026™ com o dobro de sobres oficial — pacote forte para coleção rápida.",
    destaques: ["Camisa oficial", "Álbum capa dura padrão", "24 envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Capa dura · 24",
  },
  {
    id: "pacote-br-dura-f50",
    slug: "pacote-brasil-camisa-capa-dura-50-sobres",
    nome: "Brasil — Camisa + Álbum capa dura + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-dura.jpg",
    preco: 689.9,
    precoOriginal: 724.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Pacote alto volume figurinhas (50 envelopes oficiais) comprovando o lado colecionador + camisa oficial e álbum capa dura padrão Panini Copa 2026™.",
    destaques: ["Camisa oficial", "Capa dura", "50 pacotes figurinha"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Capa dura · 50",
  },
  {
    id: "pacote-br-cartao-f12",
    slug: "pacote-brasil-camisa-capa-cartao-12-sobres",
    nome: "Brasil — Camisa + Álbum capa cartão + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil.jpg",
    preco: 389.9,
    precoOriginal: 408.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Entrada acessível: camisa oficial com o ícone porta‑figurinhas capa cartão Panini FIFA 2026™ e primeira leva oficial de figurinhas (12 envelopes).",
    destaques: ["Camisa oficial Brasil", "Álbum capa cartão", "12 envelopes Copa 2026™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão · 12",
  },
  {
    id: "pacote-br-cartao-f24",
    slug: "pacote-brasil-camisa-capa-cartao-24-sobres",
    nome: "Brasil — Camisa + Álbum capa cartão + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-cartao-mais-24-envelopes.png",
    preco: 469.9,
    precoOriginal: 492.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Amplia coleção rápido com entrada capa cartão mas dobrando sobres oficial + camisa oficial em um único SKU montado pela loja parceira.",
    destaques: ["Camisa oficial", "Capa cartão Panini oficial", "24 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão · 24",
  },
  {
    id: "pacote-br-cartao-f50",
    slug: "pacote-brasil-camisa-capa-cartao-50-sobres",
    nome: "Brasil — Camisa + Álbum capa cartão + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/panini/album-capa-cartao.jpg",
    preco: 639.9,
    precoOriginal: 674.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Máximo volume sem subir para capa dura: camisa oficial, álbum capa cartão FIFA 2026™ e 50 pacotes envelopes oficiais Panini — pedido completo de bancada.",
    destaques: ["Camisa oficial", "Capa cartão", "50 sobres oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão · 50",
  },
  // Camisa II (segunda versão) + álbum + pacotes figurinhas
  {
    id: "pacote-br-ii-ouro-f12",
    slug: "pacote-brasil-camisa-ii-camisa-ouro-12-sobres",
    nome: "Brasil — Camisa II + Álbum ouro + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 449.9,
    precoOriginal: 463.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II oficial da seleção com o álbum FIFA World Cup 2026™ capa dura ouro Panini e 12 envelopes/pacotes oficiais de figurinhas (7 por envelope, coleção Copa 2026™). Preço combinado frente aos itens avulsos.",
    destaques: ["Camiseta II", "Álbum capa ouro", "12 envelopes figurinhas Copa 2026™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro II · 12",
  },
  {
    id: "pacote-br-ii-ouro-f24",
    slug: "pacote-brasil-camisa-ii-camisa-ouro-24-sobres",
    nome: "Brasil — Camisa II + Álbum ouro + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 529.9,
    precoOriginal: 547.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Versão intermediária com Camiseta II oficial e álbum ouro Panini FIFA 2026™: mais volume até a Copa — 24 pacotes envelopes oficiais de figurinha.",
    destaques: ["Camiseta II", "Álbum ouro", "24 pacotes envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro II · 24",
  },
  {
    id: "pacote-br-ii-ouro-f50",
    slug: "pacote-brasil-camisa-ii-camisa-ouro-50-sobres",
    nome: "Brasil — Camisa II + Álbum ouro + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 699.9,
    precoOriginal: 729.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Pacote forte de colecionar com Camiseta II oficial: álbum capa ouro e 50 pacotes oficiais Panini Copa 2026™ — alto volume já na primeira leva antes do Mundial.",
    destaques: ["Camiseta II", "Álbum ouro", "50 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Ouro II · 50",
  },

  {
    id: "pacote-br-ii-prata-f12",
    slug: "pacote-brasil-camisa-ii-camisa-prata-12-sobres",
    nome: "Brasil — Camisa II + Álbum prata + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 449.9,
    precoOriginal: 463.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II oficial da seleção com edição álbum Panini FIFA 2026™ capa prata premium e entrada com 12 pacotes envelopes de figurinhas (Copa 2026™).",
    destaques: ["Camiseta II", "Álbum prata", "12 pacotes envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · 12",
  },
  {
    id: "pacote-br-ii-prata-f24",
    slug: "pacote-brasil-camisa-ii-camisa-prata-24-sobres",
    nome: "Brasil — Camisa II + Álbum prata + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 529.9,
    precoOriginal: 547.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Volume acima da média com Camiseta II oficial e álbum edição Panini FIFA 2026™ capa prata — 24 pacotes envelopes oficiais de figurinha.",
    destaques: ["Camiseta II", "Álbum prata", "24 pacotes envelopes oficiais"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · 24",
  },
  {
    id: "pacote-br-ii-prata-f50",
    slug: "pacote-brasil-camisa-ii-camisa-prata-50-sobres",
    nome: "Brasil — Camisa II + Álbum prata + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 699.9,
    precoOriginal: 729.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Colecionista acelerado com Camiseta II oficial: álbum capa prata Panini Copa 2026™ e 50 pacotes oficiais de figurinhas em um mesmo pedido.",
    destaques: ["Camiseta II", "Álbum prata", "50 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · 50",
  },

  {
    id: "pacote-br-ii-dura-f12",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-12-sobres",
    nome: "Brasil — Camisa II + Álbum capa dura + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 439.9,
    precoOriginal: 458.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II oficial com álbum capa dura Panini FIFA 2026™ (padrão) e 12 envelopes de figurinhas — custo‑benefício pra turbinar o começo.",
    destaques: ["Camiseta II", "Álbum capa dura", "12 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · 12",
  },
  {
    id: "pacote-br-ii-dura-f24",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-24-sobres",
    nome: "Brasil — Camisa II + Álbum capa dura + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 519.9,
    precoOriginal: 542.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camisa II com álbum capa dura padrão Copa 2026™ e mais volume: 24 envelopes oficiais de figurinhas.",
    destaques: ["Camiseta II", "Álbum capa dura", "24 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · 24",
  },
  {
    id: "pacote-br-ii-dura-f50",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-50-sobres",
    nome: "Brasil — Camisa II + Álbum capa dura + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 689.9,
    precoOriginal: 724.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Pacote alto volume para quem não para: Camiseta II, álbum capa dura padrão Panini Copa 2026™ e 50 pacotes de figurinhas.",
    destaques: ["Camiseta II", "Álbum capa dura", "50 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · 50",
  },

  {
    id: "pacote-br-ii-cartao-f12",
    slug: "pacote-brasil-camisa-ii-camisa-capa-cartao-12-sobres",
    nome: "Brasil — Camisa II + Álbum capa cartão + 12 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 389.9,
    precoOriginal: 408.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Entrada acessível com Camiseta II oficial, álbum capa cartão Panini FIFA 2026™ e 12 pacotes envelopes de figurinhas.",
    destaques: ["Camiseta II", "Álbum capa cartão", "12 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão II · 12",
  },
  {
    id: "pacote-br-ii-cartao-f24",
    slug: "pacote-brasil-camisa-ii-camisa-capa-cartao-24-sobres",
    nome: "Brasil — Camisa II + Álbum capa cartão + 24 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 469.9,
    precoOriginal: 492.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Amplia rápido a coleção com Camiseta II e álbum capa cartão Panini FIFA 2026™: 24 pacotes envelopes oficiais.",
    destaques: ["Camiseta II", "Álbum capa cartão", "24 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão II · 24",
  },
  {
    id: "pacote-br-ii-cartao-f50",
    slug: "pacote-brasil-camisa-ii-camisa-capa-cartao-50-sobres",
    nome: "Brasil — Camisa II + Álbum capa cartão + 50 pacotes figurinhas",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 639.9,
    precoOriginal: 674.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Máximo volume sem trocar de acabamento: Camiseta II, álbum capa cartão FIFA 2026™ e 50 pacotes envelopes oficiais de figurinhas.",
    destaques: ["Camiseta II", "Álbum capa cartão", "50 pacotes figurinhas"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Cartão II · 50",
  },
  // Camisa + álbum + N envelopes Adrenalyn XL™ (8 cards + cupom cada, ref. preço envelope avulso Panini)
  {
    id: "pacote-br-prata-adr12",
    slug: "pacote-brasil-camisa-prata-adrenalyn-12",
    nome: "Brasil — Camisa + Álbum prata + 12 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-envelope.jpg",
    preco: 499.9,
    precoOriginal: 522.6,
    selecaoSlug: brasil.slug,
    descricao:
      "Kit híbrido: camisa oficial + álbum fotográfico Copa 2026™ capa prata e expansão paralela com 12 envelopes oficiais Adrenalyn XL™ (8 cartas + cupom cada), alinhados ao anúncio Panini.",
    destaques: ["Camisa oficial", "Álbum prata figurinhas", "12 envelopes Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · Adr 12",
  },
  {
    id: "pacote-br-prata-adr24",
    slug: "pacote-brasil-camisa-prata-adrenalyn-24",
    nome: "Brasil — Camisa + Álbum prata + 24 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-starter-pack.jpg",
    preco: 639.9,
    precoOriginal: 665.4,
    selecaoSlug: brasil.slug,
    descricao:
      "Dobrar o booster Adrenalyn XL™ em cima da base figura‑álbum Panini capa prata e da camisa oficial — 24 envelopes oficiais de cartas Copa 2026™.",
    destaques: ["Camisa oficial", "Álbum prata", "24 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · Adr 24",
  },
  {
    id: "pacote-br-prata-adr30",
    slug: "pacote-brasil-camisa-prata-adrenalyn-30",
    nome: "Brasil — Camisa + Álbum prata + 30 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-starter-pack.jpg",
    preco: 699.9,
    precoOriginal: 736.8,
    selecaoSlug: brasil.slug,
    descricao:
      "Volume Adrenalyn XL™ (30 envelopes oficiais) somado ao álbum edição Panini FIFA 2026™ capa prata e camisa Brasil — pacote torcedor que mistura campo e deck.",
    destaques: ["Camisa oficial", "Álbum prata", "30 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata · Adr 30",
  },
  {
    id: "pacote-br-dura-adr12",
    slug: "pacote-brasil-camisa-capa-dura-adrenalyn-12",
    nome: "Brasil — Camisa + Álbum capa dura + 12 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-envelope.jpg",
    preco: 494.9,
    precoOriginal: 517.7,
    selecaoSlug: brasil.slug,
    descricao:
      "Camisa oficial com álbum capa dura padrão FIFA 2026™ e 12 envelopes oficiais Adrenalyn XL™ — duas frentes da mesma Copa em um pedido.",
    destaques: ["Camisa oficial", "Capa dura figurinhas", "12 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura · Adr 12",
  },
  {
    id: "pacote-br-dura-adr24",
    slug: "pacote-brasil-camisa-capa-dura-adrenalyn-24",
    nome: "Brasil — Camisa + Álbum capa dura + 24 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-starter-pack.jpg",
    preco: 629.9,
    precoOriginal: 660.4,
    selecaoSlug: brasil.slug,
    descricao:
      "Refino no volume de cartas: 24 envelopes Adrenalyn XL™ oficiais + camisa oficial e álbum capa dura padrão Panini Copa 2026™.",
    destaques: ["Camisa oficial", "Capa dura", "24 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura · Adr 24",
  },
  {
    id: "pacote-br-dura-adr30",
    slug: "pacote-brasil-camisa-capa-dura-adrenalyn-30",
    nome: "Brasil — Camisa + Álbum capa dura + 30 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/panini/adrenalyn-xl-starter-pack.jpg",
    preco: 699.9,
    precoOriginal: 731.8,
    selecaoSlug: brasil.slug,
    descricao:
      "Linha forte em cards paralelos: camisa oficial, álbum capa dura Panini figurinhas e 30 envelopes oficiais Adrenalyn XL™ FIFA World Cup 2026™.",
    destaques: ["Camisa oficial", "Capa dura", "30 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura · Adr 30",
  },
  // Camisa II + álbum + N envelopes Adrenalyn XL™
  {
    id: "pacote-br-ii-prata-adr12",
    slug: "pacote-brasil-camisa-ii-camisa-prata-adrenalyn-12",
    nome: "Brasil — Camisa II + Álbum prata + 12 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 499.9,
    precoOriginal: 522.6,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II oficial com álbum capa prata e 12 envelopes oficiais Adrenalyn XL™ — duas frentes da mesma Copa em um pedido.",
    destaques: ["Camiseta II", "Álbum prata figurinhas", "12 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · Adr 12",
  },
  {
    id: "pacote-br-ii-prata-adr24",
    slug: "pacote-brasil-camisa-ii-camisa-prata-adrenalyn-24",
    nome: "Brasil — Camisa II + Álbum prata + 24 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 639.9,
    precoOriginal: 665.4,
    selecaoSlug: brasil.slug,
    descricao:
      "Dobrar o booster Adrenalyn XL™ com a Camiseta II e o álbum capa prata Panini Copa 2026™: 24 envelopes oficiais de cartas.",
    destaques: ["Camiseta II", "Álbum prata", "24 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · Adr 24",
  },
  {
    id: "pacote-br-ii-prata-adr30",
    slug: "pacote-brasil-camisa-ii-camisa-prata-adrenalyn-30",
    nome: "Brasil — Camisa II + Álbum prata + 30 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 699.9,
    precoOriginal: 736.8,
    selecaoSlug: brasil.slug,
    descricao:
      "Volume Adrenalyn XL™ (30 envelopes oficiais) + Camiseta II e álbum capa prata — pacote torcedor para quem curte deck e coleção.",
    destaques: ["Camiseta II", "Álbum prata", "30 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Prata II · Adr 30",
  },
  {
    id: "pacote-br-ii-dura-adr12",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-adrenalyn-12",
    nome: "Brasil — Camisa II + Álbum capa dura + 12 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 494.9,
    precoOriginal: 517.7,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II com álbum capa dura padrão FIFA 2026™ e 12 envelopes oficiais Adrenalyn XL™ — duas frentes no mesmo pedido.",
    destaques: ["Camiseta II", "Capa dura figurinhas", "12 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · Adr 12",
  },
  {
    id: "pacote-br-ii-dura-adr24",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-adrenalyn-24",
    nome: "Brasil — Camisa II + Álbum capa dura + 24 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 629.9,
    precoOriginal: 660.4,
    selecaoSlug: brasil.slug,
    descricao:
      "Refino no volume de cartas com Camiseta II: 24 envelopes oficiais Adrenalyn XL™ + álbum capa dura e camisa no pedido.",
    destaques: ["Camiseta II", "Capa dura", "24 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · Adr 24",
  },
  {
    id: "pacote-br-ii-dura-adr30",
    slug: "pacote-brasil-camisa-ii-camisa-capa-dura-adrenalyn-30",
    nome: "Brasil — Camisa II + Álbum capa dura + 30 pacotes Adrenalyn XL™",
    categoria: "pacote",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    preco: 699.9,
    precoOriginal: 731.8,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta II e álbum capa dura para acelerar no campo com 30 envelopes oficiais Adrenalyn XL™ FIFA World Cup 2026™.",
    destaques: ["Camiseta II", "Capa dura", "30 Adrenalyn XL™"],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Dura II · Adr 30",
  },
  {
    id: "camiseta-brasil",
    slug: "camiseta-selecao-brasil",
    nome: "Camiseta Oficial Brasil 2026",
    categoria: "camiseta",
    imagemSrc: "/images/camiseta-brasil.jpg",
    galeria: GALERIA_ANUNCIO_CAMISETA_BRASIL_I,
    preco: 279.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Camiseta oficial da seleção brasileira para viver o Mundial das Américas. Tecido tecnológico e escudo em alta definição.",
    destaques: [
      "DryFit respirável",
      "Escudo premium",
      "Modelagem unissex",
      "Combo perfeito com o álbum",
    ],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Brasil",
  },
  {
    id: "camiseta-brasil-ii",
    slug: "camiseta-selecao-brasil-ii",
    nome: "Camiseta Oficial Brasil 2026 II",
    categoria: "camiseta",
    imagemSrc: "/images/camiseta-brasil-ii.png",
    galeria: GALERIA_ANUNCIO_CAMISETA_BRASIL_II,
    preco: 279.9,
    selecaoSlug: brasil.slug,
    descricao:
      "Segunda versão da camisa oficial do Brasil para a Copa 2026. Visual alternativo com acabamento premium para completar seu kit de torcedor.",
    destaques: [
      "Versão II com detalhes exclusivos",
      "Escudo premium",
      "Tecido tecnológico",
      "Escolha perfeita para colecionar",
    ],
    tamanhos: TAMANHOS,
    estoque: "em_estoque",
    badge: "Brasil II",
  },
];

export const PRODUTO_ANUNCIO_PRIORITARIO_ID = "envelope-figurinhas-atualizado";

export function getProduto(slug: string) {
  return PRODUTOS.find((p) => p.slug === slug);
}

export function getProdutoAnuncioPrioritario(): Produto | undefined {
  return PRODUTOS.find((p) => p.id === PRODUTO_ANUNCIO_PRIORITARIO_ID);
}

/** Coloca o pacote de figurinhas atualizado no topo (insere se ainda não estiver na lista). */
export function comAnuncioPrioritarioPrimeiro(produtos: Produto[]): Produto[] {
  const anuncio = getProdutoAnuncioPrioritario();
  if (!anuncio) return produtos;
  const rest = produtos.filter((p) => p.id !== anuncio.id);
  return [anuncio, ...rest];
}

export function produtosPorCategoria(cat: ProdutoCategoria) {
  const list = PRODUTOS.filter((p) => p.categoria === cat);
  if (cat === "camiseta") return list;
  return comAnuncioPrioritarioPrimeiro(list);
}

export function produtosPacotes() {
  return comAnuncioPrioritarioPrimeiro(PRODUTOS.filter((p) => p.categoria === "pacote"));
}

/** Pacotes com envelopes de figurinhas Copa 2026™ (não inclui linha Adrenalyn no slug). */
export function produtosPacotesFigurinhas() {
  return comAnuncioPrioritarioPrimeiro(
    PRODUTOS.filter((p) => p.categoria === "pacote" && !p.slug.includes("-adrenalyn-")),
  );
}

/** Pacotes que somam envelopes Adrenalyn XL™ além do álbum figurinhas e da camisa. */
export function produtosPacotesAdrenalyn() {
  return comAnuncioPrioritarioPrimeiro(
    PRODUTOS.filter((p) => p.categoria === "pacote" && p.slug.includes("-adrenalyn-")),
  );
}

/** Álbum: figurinhas, combos e avulsos (sem Adrenalyn nem caixas lojista). */
export function produtosAlbumFigurinhas() {
  return comAnuncioPrioritarioPrimeiro(
    PRODUTOS.filter(
      (p) =>
        p.categoria === "album" &&
        !p.id.startsWith("adrenalyn-xl-") &&
        !p.id.startsWith("lojista-caixa-"),
    ),
  );
}

/** Linha Adrenalyn XL™ na página do álbum. */
export function produtosAlbumAdrenalyn() {
  return comAnuncioPrioritarioPrimeiro(
    PRODUTOS.filter((p) => p.id.startsWith("adrenalyn-xl-")),
  );
}

/** Barra “Destaques” em `/pacotes`: combos álbum + envelopes (sem camisa), ordem em `PACOTES_PAGINA_DESTAQUE_IDS`. */
export function produtosPacotesHeroDestaque(): Produto[] {
  const kits = PACOTES_PAGINA_DESTAQUE_IDS.map((id) => PRODUTOS.find((p) => p.id === id)).filter(
    Boolean,
  ) as Produto[];
  return comAnuncioPrioritarioPrimeiro(kits);
}

/** Caixas atacado (seção Lojistas em `/pacotes`). */
export function produtosLojistasCaixas(): Produto[] {
  const a = PRODUTOS.find((p) => p.id === "lojista-caixa-1000-envelopes");
  const b = PRODUTOS.find((p) => p.id === "lojista-caixa-100-envelopes");
  return [a, b].filter(Boolean) as Produto[];
}

export function produtosDestaque(): Produto[] {
  return comAnuncioPrioritarioPrimeiro(
    [
      PRODUTOS.find((p) => p.id === "album-capa-dura-ouro"),
      PRODUTOS.find((p) => p.id === "album-capa-cartao"),
      PRODUTOS.find((p) => p.id === "album-capa-cartao-mais-12-envelopes"),
      PRODUTOS.find((p) => p.id === "adrenalyn-xl-starter-pack"),
      PRODUTOS.find((p) => p.id === "pacote-br-ouro-f12"),
      PRODUTOS.find((p) => p.id === "camiseta-brasil"),
    ].filter(Boolean) as Produto[],
  );
}

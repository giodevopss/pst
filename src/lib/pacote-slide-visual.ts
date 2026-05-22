import type { Produto } from "@/data/produtos";

export type PacoteSlideItem = {
  src: string;
  legenda: string;
};

export type PacoteSlideVisual = {
  itens: PacoteSlideItem[];
  tipo: "Figurinhas Copa 2026™" | "Adrenalyn XL™";
};

const CAMISA: PacoteSlideItem = {
  src: "/images/camiseta-brasil.jpg",
  legenda: "Camisa oficial Brasil",
};

const CAMISA_II: PacoteSlideItem = {
  src: "/images/camiseta-brasil-ii.png",
  legenda: "Camisa oficial Brasil II",
};

const ALBUM_OURO: PacoteSlideItem = {
  src: "/images/panini/album-capa-dura-ouro.jpg",
  legenda: "Álbum capa ouro FIFA 2026™",
};

const ALBUM_PRATA: PacoteSlideItem = {
  src: "/images/panini/album-capa-dura-prata.jpg",
  legenda: "Álbum capa prata FIFA 2026™",
};

const ALBUM_DURA: PacoteSlideItem = {
  src: "/images/panini/album-capa-dura.jpg",
  legenda: "Álbum capa dura FIFA 2026™",
};

const ALBUM_CARTAO: PacoteSlideItem = {
  src: "/images/panini/album-capa-cartao.jpg",
  legenda: "Álbum capa cartão FIFA 2026™",
};

const FIGURINHAS: PacoteSlideItem = {
  src: "/images/panini/kit-12-envelopes.jpg",
  legenda: "Pacotes envelopes figurinha",
};

const FIGURINHAS_ATUALIZADO: PacoteSlideItem = {
  src: "/images/panini/envelope-figurinhas-atualizado.png",
  legenda: "Pacotes figurinhas atualizados",
};

const ADRENALYN: PacoteSlideItem = {
  src: "/images/panini/adrenalyn-xl-envelope.jpg",
  legenda: "Envelopes Adrenalyn XL™",
};

function terceiroPanFigurinha(produto: Produto): PacoteSlideItem {
  const m = produto.nome.match(/(\d+)\s+pacotes\s+figurinhas/i);
  const n = m?.[1];
  return n
    ? { ...FIGURINHAS, legenda: `${n} pacotes envelopes figurinha` }
    : FIGURINHAS;
}

function terceiroPanFigurinhaAtualizado(produto: Produto): PacoteSlideItem {
  const m =
    produto.nome.match(/(\d+)\s+figurinhas\s+atualiz/i) ??
    produto.slug.match(/atualizado-f(\d+)/) ??
    produto.slug.match(/figurinhas-atualizado-f(\d+)/);
  const n = m?.[1];
  return n
    ? { ...FIGURINHAS_ATUALIZADO, legenda: `${n} pacotes figurinhas atualizados` }
    : FIGURINHAS_ATUALIZADO;
}

function terceiroPanAdrenalyn(produto: Produto): PacoteSlideItem {
  const m = produto.slug.match(/adrenalyn-(\d+)/);
  const n = m?.[1];
  return n
    ? { ...ADRENALYN, legenda: `${n} envelopes Adrenalyn XL™` }
    : ADRENALYN;
}

/**
 * Imagens e legendas para o carrossel de pacotes (camisa + o que entra na oferta).
 */
export function visualSlidePacote(produto: Produto): PacoteSlideVisual | null {
  if (produto.id === "envelope-figurinhas-atualizado" && produto.imagemSrc) {
    return {
      tipo: "Figurinhas Copa 2026™",
      itens: [{ src: produto.imagemSrc, legenda: "Pacote atualizado · 7 cromos" }],
    };
  }

  if (produto.categoria !== "pacote") return null;

  const { slug } = produto;
  const camisa = slug.includes("camisa-ii") ? CAMISA_II : CAMISA;

  if (slug.includes("figurinhas-atualizado")) {
    let album = ALBUM_OURO;
    if (slug.includes("capa-cartao")) album = ALBUM_CARTAO;
    else if (slug.includes("capa-dura-") && !slug.includes("ouro")) album = ALBUM_DURA;
    else if (slug.includes("ouro")) album = ALBUM_OURO;

    return {
      tipo: "Figurinhas Copa 2026™",
      itens: [camisa, album, terceiroPanFigurinhaAtualizado(produto)],
    };
  }

  if (slug.includes("-adrenalyn-")) {
    const album = slug.includes("prata-adrenalyn") ? ALBUM_PRATA : ALBUM_DURA;
    return {
      tipo: "Adrenalyn XL™",
      itens: [camisa, album, terceiroPanAdrenalyn(produto)],
    };
  }

  let album = ALBUM_OURO;
  if (slug.includes("camisa-ouro-")) album = ALBUM_OURO;
  else if (slug.includes("camisa-prata-")) album = ALBUM_PRATA;
  else if (slug.includes("camisa-capa-dura-")) album = ALBUM_DURA;
  else if (slug.includes("camisa-capa-cartao-")) album = ALBUM_CARTAO;

  return {
    tipo: "Figurinhas Copa 2026™",
    itens: [camisa, album, terceiroPanFigurinha(produto)],
  };
}

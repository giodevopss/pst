import type { Produto } from "@/data/produtos";
import { PRODUTOS } from "@/data/produtos";

/** Kit avulso: só envelopes de figurinha (linha foto‑álbum, não Adrenalyn). */
export const FIGURINHA_KIT_12_ID = "kit-12-envelopes";

/** Álbuns/ofertas que já trazem volume de envelopes no próprio SKU. */
export const ALBUM_FIGURINHA_ALREADY_BUNDLES = new Set<string>([
  "album-capa-cartao-mais-12-envelopes",
  "album-capa-cartao-mais-24-envelopes",
  "box-sacola-cartao-mais-30-envelopes",
  "box-luva-premium-torcida",
]);

export function isAdrenalynAlbumLine(id: string): boolean {
  return id.startsWith("adrenalyn-xl-");
}

/** Mostrar upsell “+ envelopes” só para foto‑álbum sem pacote de envelopes no SKU. */
export function shouldOfferFigurinhaEnvelopeUpsell(produto: Produto): boolean {
  if (produto.categoria !== "album") return false;
  if (produto.id === FIGURINHA_KIT_12_ID) return false;
  if (isAdrenalynAlbumLine(produto.id)) return false;
  if (ALBUM_FIGURINHA_ALREADY_BUNDLES.has(produto.id)) return false;
  return true;
}

export function getFigurinhaKit12Product(): Produto | undefined {
  return PRODUTOS.find((p) => p.id === FIGURINHA_KIT_12_ID);
}

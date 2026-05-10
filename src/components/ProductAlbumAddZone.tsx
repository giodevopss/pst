"use client";

import { useState } from "react";
import type { Produto } from "@/data/produtos";
import {
  getFigurinhaKit12Product,
  shouldOfferFigurinhaEnvelopeUpsell,
} from "@/lib/album-envelope-upsell";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AlbumEnvelopeUpsellModal } from "@/components/AlbumEnvelopeUpsellModal";

type Props = {
  produto: Produto;
} & Omit<React.ComponentProps<typeof AddToCartButton>, "produto">;

export function ProductAlbumAddZone({ produto, ...rest }: Props) {
  const kit = getFigurinhaKit12Product();
  const offer = shouldOfferFigurinhaEnvelopeUpsell(produto) && kit != null;

  const [upsellOpen, setUpsellOpen] = useState(false);

  if (!offer || !kit) {
    return <AddToCartButton produto={produto} {...rest} />;
  }

  return (
    <>
      <AddToCartButton
        {...rest}
        produto={produto}
        afterAdd={() => setUpsellOpen(true)}
      />
      <AlbumEnvelopeUpsellModal
        open={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        kitProduto={kit}
        triggerAlbumNome={produto.nome}
      />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { PedidoAcompanhamentoClient } from "@/components/pedido/PedidoAcompanhamentoClient";
import { PedidoTimeline } from "@/components/pedido/PedidoTimeline";
import { getPedidoById } from "@/lib/pedidos-store";
import { isPedidoIdValid, toPublicPedido } from "@/lib/pedido-public";

export const metadata: Metadata = {
  title: "Pedido recebido — acompanhe seu pedido",
  description:
    "Seu pedido foi registrado. Acompanhe as etapas: pedido feito, pagamento, separação, envio e entrega.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function SucessoPage({ searchParams }: PageProps) {
  const { id: rawId } = await searchParams;
  const orderId = rawId?.trim() ?? "";

  let initialPedido = null;
  if (orderId && isPedidoIdValid(orderId)) {
    try {
      const registro = await getPedidoById(orderId);
      if (registro) initialPedido = toPublicPedido(registro);
    } catch {
      /* cliente hidrata via API / localStorage */
    }
  }

  const timelinePedido = initialPedido
    ? { etapa: initialPedido.etapa, statusPagamento: initialPedido.statusPagamento }
    : { etapa: "pedido_feito" as const, statusPagamento: "pendente" as const };

  const timeline = (
    <PedidoTimeline
      pedido={timelinePedido}
      className="border-brand-yellow/40 bg-background-elev/60 shadow-inner ring-1 ring-brand-yellow/20"
    />
  );

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted">
          Carregando seu pedido...
        </div>
      }
    >
      <PedidoAcompanhamentoClient
        orderId={orderId}
        initialPedido={initialPedido}
        timelineSlot={timeline}
      />
    </Suspense>
  );
}

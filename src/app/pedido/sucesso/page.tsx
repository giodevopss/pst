import type { Metadata } from "next";
import { Suspense } from "react";
import { PedidoAcompanhamentoClient } from "@/components/pedido/PedidoAcompanhamentoClient";

export const metadata: Metadata = {
  title: "Pedido recebido — acompanhe seu pedido",
  description:
    "Seu pedido foi registrado. Acompanhe as etapas: pedido feito, pagamento, separação, envio e entrega.",
};

export const dynamic = "force-dynamic";

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted">
          Carregando seu pedido...
        </div>
      }
    >
      <PedidoAcompanhamentoClient />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { AcompanharPedidoClient } from "./AcompanharPedidoClient";

export const metadata: Metadata = {
  title: "Acompanhar pedido",
  description: "Acompanhe as etapas do seu pedido Copa 2026 — pagamento, separação e entrega.",
};

export const dynamic = "force-dynamic";

export default function AcompanharPedidoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted">
          Carregando seu pedido...
        </div>
      }
    >
      <AcompanharPedidoClient />
    </Suspense>
  );
}

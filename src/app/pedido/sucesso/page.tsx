import type { Metadata } from "next";
import { Suspense } from "react";
import { SucessoClient } from "./SucessoClient";

export const metadata: Metadata = {
  title: "Pedido recebido — pague com PIX",
  description: "Seu pedido foi recebido. Agora é só pagar com PIX e aguardar a confirmação.",
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
      <SucessoClient />
    </Suspense>
  );
}

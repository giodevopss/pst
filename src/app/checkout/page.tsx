import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  description:
    "Complete seu pedido na Copa 2026 Store: pagamento via PIX e atendimento humano por WhatsApp.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
          Passo final
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
          Quase lá. <span className="gradient-text">Finalizar pedido.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Preencha seus dados, escolha PIX e em segundos você recebe o QR Code para pagar.
          O frete é combinado com você no WhatsApp logo após confirmação do pedido.
        </p>
      </div>

      <CheckoutForm />
    </section>
  );
}

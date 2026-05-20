import { redirect } from "next/navigation";

/** Mesma tela de sucesso/acompanhamento — URL canónica: /pedido/sucesso */
export default async function AcompanharPedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id) {
    redirect(`/pedido/sucesso?id=${encodeURIComponent(id)}`);
  }
  redirect("/pedido/sucesso");
}

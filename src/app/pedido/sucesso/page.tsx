import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Pedido recebido",
};

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id) {
    redirect(`/pedido/acompanhar?id=${encodeURIComponent(id)}`);
  }
  redirect("/pedido/acompanhar");
}

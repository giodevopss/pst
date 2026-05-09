import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyUserCookie, USER_COOKIE_NAME } from "@/lib/user-cookie";
import { findByEmail } from "@/lib/usuarios-store";
import { listPedidosRecent } from "@/lib/pedidos-store";
import { ContaClient } from "./ContaClient";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Gerencie seus dados e veja seus pedidos.",
};

export default async function ContaPage() {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE_NAME)?.value;
  const email = await verifyUserCookie(raw);

  if (!email) {
    redirect("/checkout");
  }

  const user = await findByEmail(email);
  if (!user) {
    redirect("/checkout");
  }

  const allPedidos = await listPedidosRecent(500);
  const meusPedidos = allPedidos.filter(
    (p) => p.cliente.email?.toLowerCase() === email,
  );

  const { senhaHash: _, ...publicUser } = user;

  return <ContaClient usuario={publicUser} pedidos={meusPedidos} />;
}

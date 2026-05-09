import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserCookie, USER_COOKIE_NAME } from "@/lib/user-cookie";
import { findByEmail, updateUsuario } from "@/lib/usuarios-store";
import type { Usuario, UsuarioPublico } from "@/types/usuario";

function sanitize(u: Usuario): UsuarioPublico {
  const { senhaHash: _, ...rest } = u;
  return rest;
}

export async function GET() {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE_NAME)?.value;
  const email = await verifyUserCookie(raw);
  if (!email) {
    return NextResponse.json({ usuario: null }, { status: 401 });
  }
  const user = await findByEmail(email);
  if (!user) {
    return NextResponse.json({ usuario: null }, { status: 401 });
  }
  return NextResponse.json({ usuario: sanitize(user) });
}

export async function PATCH(req: Request) {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE_NAME)?.value;
  const email = await verifyUserCookie(raw);
  if (!email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.nome === "string" && body.nome.trim().length >= 2)
    patch.nome = body.nome.trim();
  if (typeof body.telefone === "string")
    patch.telefone = body.telefone.trim();
  if (body.endereco && typeof body.endereco === "object")
    patch.endereco = body.endereco;

  const updated = await updateUsuario(email, patch);
  if (!updated) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ usuario: sanitize(updated) });
}

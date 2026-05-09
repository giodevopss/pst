import { NextResponse } from "next/server";
import { createUsuario, findByEmail } from "@/lib/usuarios-store";
import { hashPassword } from "@/lib/password";
import { createUserCookieValue, USER_COOKIE_NAME } from "@/lib/user-cookie";
import type { Usuario, UsuarioPublico } from "@/types/usuario";

function sanitize(u: Usuario): UsuarioPublico {
  const { senhaHash: _, ...rest } = u;
  return rest;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const telefone = typeof body.telefone === "string" ? body.telefone.trim() : "";
  const senha = typeof body.senha === "string" ? body.senha : "";

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }
  if (nome.length < 2) {
    return NextResponse.json({ error: "Nome obrigatório (mín. 2 caracteres)" }, { status: 400 });
  }
  if (senha.length < 6) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 });
  }

  const existing = await findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
  }

  const endereco =
    body.endereco && typeof body.endereco === "object"
      ? (body.endereco as Usuario["endereco"])
      : undefined;

  const now = new Date().toISOString();
  const user: Usuario = {
    id: `U-${Date.now().toString(36).toUpperCase()}`,
    email,
    nome,
    telefone,
    senhaHash: await hashPassword(senha),
    endereco,
    criadoEm: now,
    atualizadoEm: now,
  };

  await createUsuario(user);

  const cookieValue = await createUserCookieValue(email);
  const res = NextResponse.json({ ok: true, usuario: sanitize(user) }, { status: 201 });
  res.cookies.set(USER_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 3600,
  });
  return res;
}

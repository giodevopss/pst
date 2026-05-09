import { NextResponse } from "next/server";
import { findByEmail } from "@/lib/usuarios-store";
import { verifyPassword } from "@/lib/password";
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
  const senha = typeof body.senha === "string" ? body.senha : "";

  if (!email || !senha) {
    return NextResponse.json({ error: "E-mail e senha obrigatórios" }, { status: 400 });
  }

  const user = await findByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const ok = await verifyPassword(senha, user.senhaHash);
  if (!ok) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const cookieValue = await createUserCookieValue(email);
  const res = NextResponse.json({ ok: true, usuario: sanitize(user) });
  res.cookies.set(USER_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 3600,
  });
  return res;
}

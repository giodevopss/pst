import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-cookie";

export async function POST(req: Request) {
  const url = new URL("/admin/login", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

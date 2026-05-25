import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkPassword,
  signSession,
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const supplied = typeof body.password === "string" ? body.password : "";
  if (!checkPassword(supplied)) {
    return new NextResponse(null, { status: 401 });
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = signSession({ exp });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return new NextResponse(null, { status: 204 });
}

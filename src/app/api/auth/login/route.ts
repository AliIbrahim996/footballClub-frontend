import { NextResponse } from "next/server";
import { forwardedFor } from "@/lib/client-ip";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${BACKEND_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": request.headers.get("accept-language") ?? "en",
      ...(forwardedFor(request) ? { "x-forwarded-for": forwardedFor(request)! } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json({ detail: data.detail ?? "Sign-in failed." }, { status: res.status });

  const out = NextResponse.json({ username: data.username });
  out.cookies.set(TOKEN_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "1",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return out;
}

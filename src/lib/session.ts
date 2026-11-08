import "server-only";
import { NextResponse } from "next/server";
import { forwardedFor } from "./client-ip";
import { BACKEND_URL, TOKEN_COOKIE } from "./server";

/** POST JSON to a Django auth endpoint; on success set the httpOnly session cookie, else pass the error through. */
export async function authProxy(request: Request, path: string) {
  const body = await request.json().catch(() => ({}));
  const upstream = await fetch(`${BACKEND_URL}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": request.headers.get("accept-language") ?? "en",
      ...(forwardedFor(request) ? { "x-forwarded-for": forwardedFor(request)! } : {}),
    },
    body: JSON.stringify(body),
  }).catch(() => null);
  if (!upstream) return NextResponse.json({ detail: "unreachable" }, { status: 502 });
  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });

  const out = NextResponse.json({ username: data.username }, { status: upstream.status });
  out.cookies.set(TOKEN_COOKIE, data.token, {
    httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "1", path: "/", maxAge: 60 * 60 * 24 * 14,
  });
  return out;
}

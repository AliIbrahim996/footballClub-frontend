import { NextResponse } from "next/server";
import { forwardedFor } from "@/lib/client-ip";
import { BACKEND_URL } from "@/lib/server";

/** Public (no login) proxy for the "contact us" form. */
export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 10_000) return NextResponse.json({ detail: "Too large." }, { status: 413 });
  const res = await fetch(`${BACKEND_URL}/api/contact/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": request.headers.get("accept-language") ?? "en",
      ...(forwardedFor(request) ? { "x-forwarded-for": forwardedFor(request)! } : {}),
    },
    body,
  }).catch(() => null);
  if (!res) return NextResponse.json({ detail: "unreachable" }, { status: 502 });
  return new NextResponse(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
}

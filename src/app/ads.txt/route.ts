// Served only once ADSENSE_PUB_ID (e.g. "pub-1234567890123456") is configured.
export function GET() {
  const pub = process.env.ADSENSE_PUB_ID;
  if (!pub) return new Response("Not found", { status: 404 });
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain" } });
}

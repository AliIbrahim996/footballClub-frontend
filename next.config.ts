import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Server-side URL of the Django API (service name inside Docker, localhost in dev).
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "backend" },
      { protocol: "http", hostname: "api" },
    ],
  },
  async rewrites() {
    // Uploaded images (player photos, tactic exports) are served by Django.
    return [{ source: "/media/:path*", destination: `${BACKEND_URL}/media/:path*` }];
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);


import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Server-side URL of the Django API (service name inside Docker, localhost in dev).
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

// STATIC_EXPORT=1 (see scripts/build-static.mjs): plain HTML/CSS/JS for GitHub Pages and other static hosts.
// Only the public pages and the free designer exist in that build: no API routes, no proxy, no rewrites.
const STATIC_EXPORT = process.env.STATIC_EXPORT === "1";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // e.g. "/footballClub-frontend" for a GitHub project page

const nextConfig: NextConfig = STATIC_EXPORT
  ? {
      output: "export",
      trailingSlash: true,
      basePath: BASE_PATH || undefined,
      images: { unoptimized: true },
      poweredByHeader: false,
    }
  : {
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


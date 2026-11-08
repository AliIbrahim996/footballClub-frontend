import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Public marketing pages are open to search and AI crawlers; the signed-in app is not.
const PRIVATE = ["/api/", "/*/dashboard", "/*/players", "/*/plans", "/*/tactics", "/*/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot"]
        .map((userAgent) => ({ userAgent, allow: ["/", "/llms.txt"], disallow: PRIVATE })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

// Required for `output: "export"` (static hosting); harmless for the normal server build.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

import { SIGNUPS_OPEN } from "@/lib/flags";

const PATHS = ["", "/features", "/designer", "/contact", ...(SIGNUPS_OPEN ? ["/register"] : [])];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}/${l}${path}`])) },
    })),
  );
}

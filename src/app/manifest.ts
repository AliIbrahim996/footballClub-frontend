import type { MetadataRoute } from "next";

// Makes the site installable on Android/iOS/desktop ("Add to home screen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pitchside",
    short_name: "Pitchside",
    description: "Football club management: squad, ratings and tactics board.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f0a",
    theme_color: "#15803d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}

// Required for `output: "export"` (static hosting); harmless for the normal server build.
export const dynamic = "force-static";

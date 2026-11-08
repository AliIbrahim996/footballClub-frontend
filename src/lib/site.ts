export const SITE = {
  name: "Pitchside",
  tagline: "Run your football club from one place",
  description:
    "Pitchside is a football club management app: keep a squad database, rate players on technical, physical, tactical and mental skills, and design tactical plans on an interactive board.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/** Sub-path the site is served from ("" unless deployed as a GitHub project page), and static-export URL style. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const TRAILING_SLASH = process.env.STATIC_EXPORT === "1" ? "/" : "";
export const SITE_ORIGIN = new URL(SITE.url).origin;

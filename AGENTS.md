<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project guide (footballclub-frontend)

Next.js 16 App Router + Tailwind v4 + next-intl (en/de/ar). Backend is the separate `footballClub-backend` repo (Django REST); this repo never talks to the DB.

## Commands
- `npm run dev`, `npm run build`, `npm run lint` — use **Node 22+**. Run build + lint before finishing.
- `docker compose up --build` (frontend) / `--profile with-api` (adds API + PostgreSQL from `../footballClub-backend`).

## Conventions
- Every user-visible string goes in `messages/en.json`, `de.json` AND `ar.json` (same keys). No hard-coded UI text.
- Use logical Tailwind classes (`ps-`, `pe-`, `start-`, `text-end`, `border-e`) so RTL works. Use `Link/useRouter/redirect` from `@/i18n/navigation`, not `next/link`.
- Pages: `export` `generateMetadata`, call `setRequestLocale(locale)`. Public pages need `alternates(locale, path)` from `src/lib/seo.ts` and an entry in `src/app/sitemap.ts`.
- Server data via `api()` in `src/lib/server.ts`; browser mutations via `call()` in `src/lib/client.ts` (goes through the `/api` proxy). API types live in `src/lib/types.ts` — update when the backend contract changes.
- Design tokens are CSS variables in `src/app/globals.css`; reuse `src/components/ui.tsx`. Keep it responsive (mobile bottom tabs, sidebar ≥ md) and respect reduced motion.
- Design skills are installed in `.claude/skills` (frontend-design, design-taste-frontend, emil-design-eng, animation skills). Note: design-taste-frontend targets marketing sites; apply its principles to the landing pages, not the app screens.
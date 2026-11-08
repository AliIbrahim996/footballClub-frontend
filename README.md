# Pitchside — frontend

Next.js (App Router, SSR) web app for football club management: public landing/feature pages, a signed-in dashboard, player database with skill ratings, saved tactical plans and a native interactive **tactics board** (replacing the old third-party iframe). Languages: English, German, Arabic (RTL). The API lives in the sibling repo **footballClub-backend** (Django REST + PostgreSQL).

## Requirements
- Node.js **22+** (Tailwind v4 needs ≥ 20.19)
- A running API (see below)

## Run locally
```bash
cp .env.example .env.local      # BACKEND_URL defaults to http://127.0.0.1:8000
npm install
npm run dev                     # http://localhost:3000  (redirects to /en)
```
Demo login (when the API was seeded with `python manage.py seed --admin`): `admin` / `admin12345`.

## Docker
```bash
docker compose up --build                     # frontend only, API at BACKEND_URL (default host:8000)
docker compose --profile with-api up --build  # also builds ../footballClub-backend + PostgreSQL
```
Set `NEXT_PUBLIC_SITE_URL` to your public origin (used for sitemap, canonical and hreflang URLs) and `COOKIE_SECURE=1` behind HTTPS.

## How it works
- `src/app/[locale]/…` — all pages; `(marketing)` is public + crawlable, `(app)` requires login (`src/proxy.ts`).
- Auth token lives in an httpOnly cookie. Browser calls go to `/api/*`, a same-origin proxy that adds the token and forwards `Accept-Language`, so Django returns messages in the UI language. `/media/*` is rewritten to the API.
- `src/components/board/` — SVG tactics board: pitches (full/half/box/blank), players, ball, cones, goals, runs/passes/dribbles, zones, text, formations, undo/redo, PNG export, save to API.
- SEO/AI: server-rendered pages, per-locale metadata + hreflang, JSON-LD (Organization, SoftwareApplication, FAQPage), `sitemap.xml`, `robots.txt` (AI crawlers allowed on public pages), `public/llms.txt`.
- Translations: `messages/{en,de,ar}.json` (keep keys identical).

## Scripts
`npm run dev` · `npm run build` · `npm run lint`

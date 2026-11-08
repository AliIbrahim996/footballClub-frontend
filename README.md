# Pitchside — frontend

[![Support on Patreon](https://img.shields.io/badge/Support%20on-Patreon-F96854?logo=patreon&logoColor=white)](https://patreon.com/AliIbrahim870)

Football club management in the browser: a **free tactics designer** (no account), plus a paid **club management system** with player database, skill ratings, cloud-saved plans, team invites and share links. Next.js (App Router, SSR) in **English, German and Arabic (RTL)**. The API is the sibling repo **footballClub-backend** (Django REST + PostgreSQL).

## Screenshots

| Landing page | Free tactics designer |
|---|---|
| ![Landing page](docs/screenshots/landing.jpg) | ![Free designer with 11 playing fields](docs/screenshots/designer.jpg) |

| Dashboard | Tactics board with saved plan |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.jpg) | ![Tactics board](docs/screenshots/tactics.jpg) |

| Players | Skill evaluation |
|---|---|
| ![Players](docs/screenshots/players.jpg) | ![Player detail with ratings](docs/screenshots/player-detail.jpg) |

| Pricing | Arabic (RTL) on mobile |
|---|---|
| ![Pricing](docs/screenshots/pricing.jpg) | <img src="docs/screenshots/mobile-ar-dashboard.jpg" width="240" alt="Arabic dashboard on mobile"> <img src="docs/screenshots/mobile-ar-designer.jpg" width="240" alt="Arabic designer on mobile"> |

> Screenshots use fictional demo data.

## Support the project
If Pitchside is useful to you, you can support its development on **[Patreon](https://patreon.com/AliIbrahim870)**. Thank you!

The tactics board is a native SVG editor that replaced the old third-party iframe.

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

## Product model
- **Free:** the tactics designer at `/designer` (no account, autosaves in the browser, PNG export; ads optional).
- **Paid:** the club management system (players, ratings, cloud plans, team invites, share links) - one free 14-day trial per club, then Stripe subscription. See [docs/DEPLOY.md](docs/DEPLOY.md) for hosting, Stripe, ads, Google Cloud and the Android APK.

## Scripts
`npm run dev` · `npm run build` · `npm run lint`

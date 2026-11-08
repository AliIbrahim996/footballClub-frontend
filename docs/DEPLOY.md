# Deploying Pitchside

Two services: **web** (this repo, Next.js) and **api** (`footballClub-backend`, Django + PostgreSQL). The browser only talks to `web`;
`web` calls `api` server-side, so no CORS setup is needed and the login token never reaches JavaScript.

```
browser ──► web (Next.js, :3000) ──► api (Django, :8000) ──► PostgreSQL
                  └── /media/* rewritten to api (uploads)        └── uploads: disk or Google Cloud Storage
```

## Launch for free: designer + "contact us" (no backend, no database)
The free designer is entirely client-side (boards autosave in the visitor's browser), so you can launch with **only the web app**. Build with:

| Build-time variable | Value | Effect |
|---|---|---|
| `NEXT_PUBLIC_DESIGNER_ONLY` | `1` | public pages + designer only; sign-in/account pages redirect home; no backend needed |
| `NEXT_PUBLIC_SIGNUPS_OPEN` | `0` (default) | every "free trial" call to action becomes "Contact us for the full version" |
| `NEXT_PUBLIC_CONTACT_MODE` | `mailto` (default) | contact page shows your email address; nothing to host |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `you@example.com` | the address shown / used |
| `NEXT_PUBLIC_SITE_URL` | `https://your.domain` | canonical URLs, sitemap, hreflang |

`NEXT_PUBLIC_*` values are compiled into the site: set them as **build** variables/arguments (Docker `--build-arg`, or the host's build environment), then rebuild after changing them.
Where to host it (check each provider's current free limits and terms before relying on them):

| Host | How | Notes |
|---|---|---|
| **Render** (free web service) | New Web Service from the GitHub repo, runtime Docker, add the variables above | free instances sleep when idle, so the first visit after a pause is slow |
| **Google Cloud Run** | `deploy-cloud-run.yml` workflow (set repository variables `DESIGNER_ONLY=1`, `CONTACT_EMAIL`, `SITE_URL`, `BACKEND_URL` can be any placeholder) | generous free quota and scale-to-zero, but a billing account (card) is required |
| **Vercel / Netlify** | import the repo, set the variables as build env | Vercel's free Hobby plan is for **non-commercial** use only: fine for a free designer, move to a paid plan or another host once you charge |
| **Your own machine** + free Cloudflare Tunnel | `docker build` with the build args, `docker run -p 3000:3000` | free, but only up while the machine is on |

A custom domain is the only recurring cost (about 10 EUR per year). Without one the host gives you a free subdomain (for example `pitchside.onrender.com`), which is enough to start, but AdSense and good SEO want your own domain.

### GitHub Pages (free static hosting for the designer)
GitHub Pages only serves static files, so it can host the **designer-only** site (landing, features, designer, contact by email, legal pages) but **not** login, club management, the contact form API or share links. `npm run build:static` builds exactly that into `out/` (it works on a temporary copy of the project, your working tree is untouched).

1. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Optional repository **variables** (Settings → Secrets and variables → Actions → Variables): `CONTACT_EMAIL`, `LEGAL_NAME`, `LEGAL_STREET`, `LEGAL_CITY`, `LEGAL_EMAIL`, … (imprint and privacy policy; see "Legal pages" below), `ADSENSE_*` if you use ads.
3. Push to `main` (or run **Deploy designer to GitHub Pages** from the Actions tab). The workflow `.github/workflows/pages.yml` builds with `npm run build:static` and publishes `out/`.
4. The site appears at `https://<user>.github.io/<repo>/` (a *project page*, served from a sub-path; the build handles the sub-path automatically). For a clean address use a **custom domain** (Settings → Pages → Custom domain, plus a DNS `CNAME` to `<user>.github.io`, then tick "Enforce HTTPS"): the sub-path disappears and the site is served from the domain root.

Things to know:
- Search engines only read `robots.txt` and `sitemap.xml` at a domain root, so on a project page they are ignored. A custom domain (or a repository named `<user>.github.io`) fixes this and is also needed for AdSense.
- Contact is `mailto:` only (set `CONTACT_EMAIL`); there is no server to store messages.
- Check GitHub's current Pages terms and limits before relying on them: Pages is meant for projects and sites, **not** for running a commercial SaaS or shop, and has size/bandwidth soft limits. A free designer with a "contact us" page is the intended kind of use; the paid club system belongs on a server (see Options A/B).
- To try it locally: `npm run build:static`, then serve `out/` with any static file server (for a project page, serve it under the same `/<repo>` sub-path).
- Open question when you later switch to the full app: keep Pages as the marketing front and point "Sign in" at the server deployment, or move everything to the server.

### Contact form with storage (optional, needs the API)
Set `NEXT_PUBLIC_CONTACT_MODE=form` and deploy the API (`SIGNUPS_OPEN` stays `0`). Messages are saved in the database (Django admin, "Contact messages") and e-mailed to `CONTACT_EMAIL` when you configure SMTP. The form is rate limited and has a honeypot against bots.

### Opening sign-ups later
Set `SIGNUPS_OPEN=1` on the API **and** rebuild the web app with `NEXT_PUBLIC_SIGNUPS_OPEN=1` (and `NEXT_PUBLIC_DESIGNER_ONLY=0`). Until you do, the API itself refuses registrations (HTTP 403), so the free trial cannot be started by calling it directly. Clubs you create by hand in the Django admin can still sign in.

## Option A: one machine with Docker Compose (cheapest)
Works on a home PC / Raspberry Pi, an Oracle Cloud free VM, or a Google Cloud `e2-micro` (always-free in some US regions).
```bash
git clone <backend repo> footballClub-backend
git clone <frontend repo> footballclub-frontend && cd footballclub-frontend
docker compose --profile with-api up --build -d
```
Put HTTPS in front (needed for logins over the internet and for the Android app): a free **Cloudflare Tunnel** or Caddy/nginx with Let's Encrypt.
Then set `NEXT_PUBLIC_SITE_URL=https://your.domain`, `COOKIE_SECURE=1`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, and `SEED_DEMO_DATA=0`.
`DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD` have **no defaults**: put them in `.env` (git-ignored; generate with
`python -c "import secrets; print(secrets.token_urlsafe(50))"`). The containers refuse to start without them. Set `NUM_PROXIES` to the number of
reverse proxies in front of the API (Next.js counts as 1, plus any load balancer) so rate limits apply per visitor, not per proxy.

## Option B: Google Cloud Run (managed, scales to zero)
| Piece | Service | Cost note |
|---|---|---|
| web + api | Cloud Run (two services) | free tier, then pay per use; cold start after idle |
| Database | Neon / Supabase free Postgres, or Cloud SQL | Cloud SQL has no free tier (roughly $10+/month) |
| Uploads | Cloud Storage bucket (`MEDIA_STORAGE=gcs`, `GS_BUCKET_NAME`) | Cloud Run disks are ephemeral, so this is required |
| Images | Artifact Registry | small |

API env: `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS=<api host>`, `POSTGRES_HOST/DB/USER/PASSWORD`, `POSTGRES_SSLMODE=require`,
`MEDIA_STORAGE=gcs`, `GS_BUCKET_NAME`, `NUM_PROXIES=2` (Cloud Run front end + Next.js), `FRONTEND_URL`, plus Stripe/email variables below.
The API **refuses to start in production without `POSTGRES_HOST`** (it never silently falls back to SQLite). Web env: `BACKEND_URL=https://<api host>`, `COOKIE_SECURE=1`.
Make the bucket objects publicly readable (uploaded plan images and player photos are served by URL), and give the API's service account
`roles/storage.objectAdmin` on it.

### Deploy from GitHub Actions (no stored keys)
1. Create an Artifact Registry Docker repo and a deploy service account with `roles/run.admin`, `roles/artifactregistry.writer`, `roles/iam.serviceAccountUser`.
2. Create a Workload Identity Pool + GitHub OIDC provider restricted to your repo, and let it impersonate the deploy account
   (`gcloud iam workload-identity-pools ...`; see Google's "Authenticate to Google Cloud from GitHub Actions").
3. Add the repository **variables** listed at the top of `.github/workflows/deploy-cloud-run.yml` (both repos), and the API secrets in Secret Manager.
4. Run the workflow from the Actions tab. These two deploy workflows are templates and have not been run.

GitHub Pages cannot host this app (it needs a server). GitHub's role here is code, CI (`ci.yml`), container builds and deploy triggers.

## Billing (Stripe)
1. Create a Stripe account, a **Product with a recurring Price**, and copy the Price id.
2. API env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`.
3. In Stripe, add a webhook to `https://<api host>/api/billing/webhook/` for `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`, and copy its signing secret.
4. Enable the Customer Portal in Stripe (used by "Manage subscription").
5. Test with Stripe test keys and the card `4242 4242 4242 4242` before going live.
Without these variables the app runs, but the Billing page shows that online payment is not set up. If you sell in the EU, consider a
merchant of record (Paddle / Lemon Squeezy) to avoid handling VAT yourself; that would need a different billing module.

**Free trial rules:** each club gets one trial (`TRIAL_DAYS`, default 14) when it registers; it is never restarted. An expired trial returns HTTP 402 and
the app redirects to the Billing page. Seats per club: `MAX_SEATS` (default 5).

## Email (invitations)
Set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`. Without them invitation emails are printed in the API log;
owners can always copy the invite link from the Team page.

## Ads (optional)
Ads render only on the free designer and shared-plan pages, never in the signed-in app, and only after the visitor accepts the banner.
1. Publish on a real domain with the legal pages, then apply to Google AdSense.
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…`, `NEXT_PUBLIC_ADSENSE_SLOT_DESIGNER=<ad unit id>` and `ADSENSE_PUB_ID=pub-…` (serves `/ads.txt`).
3. For EU/UK visitors Google requires a certified consent platform (TCF). Replace the minimal banner in `src/components/ads.tsx` with
   Google Funding Choices, Cookiebot or Usercentrics before enabling ads in production.

## Android app
- **Install from the browser (PWA):** the site has a web manifest, so Chrome offers "Add to home screen". No store or build needed.
- **APK:** `.github/workflows/android.yml` builds a debug APK that wraps your hosted site with Capacitor. Set the repository variable `APP_URL`
  (your public HTTPS URL), run the workflow, and download the artifact. Side-loading is free. Publishing on Google Play needs a one-time $25
  developer account and a signed release build (add your keystore as GitHub secrets). The APK has not been built in this environment.
- Ads (AdSense) are not allowed inside app WebViews; the wrapped app shows the site without them being relied on for revenue.

## Legal pages (required before launch)
Set `NEXT_PUBLIC_LEGAL_NAME`, `_STREET`, `_CITY`, `_EMAIL` (and `_PHONE`, `_VAT_ID`, `_REGISTER`, `_REPRESENTATIVE`, `_HOSTING` where they apply) as **build** variables (Docker `--build-arg`, or the deploy workflow's repository variables `LEGAL_NAME`, `LEGAL_STREET`, …). They fill the imprint, privacy policy and terms. See [legal/COMPLIANCE_CHECKLIST.md](legal/COMPLIANCE_CHECKLIST.md).

## Before charging customers
- Privacy policy, terms, and (Germany) an imprint; GDPR applies, especially for youth players' data.
- Back up the database and bucket; set `DJANGO_DEBUG=0`, rotate the demo admin password, turn off `SEED_DEMO_DATA`.
- One trial per club is enforced by unique email; determined users can still use new emails, so watch for abuse.

## Uploads on AWS, Google Cloud or Azure (`MEDIA_STORAGE`)
The API stores plan images and player photos through one setting, so the cloud is a deployment choice, not a code change:

| Cloud | `MEDIA_STORAGE` | Variables | Identity (no static keys needed) |
|---|---|---|---|
| any single machine | `local` | `MEDIA_ROOT` (a Docker volume) | n/a |
| AWS S3 (also R2, MinIO, Spaces, B2) | `s3` | `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`, optional `AWS_S3_ENDPOINT_URL` | IAM role on ECS/App Runner/EC2 |
| Google Cloud Storage | `gcs` | `GS_BUCKET_NAME` | Cloud Run service account |
| Azure Blob Storage | `azure` | `AZURE_ACCOUNT_NAME`, `AZURE_CONTAINER`, plus `AZURE_ACCOUNT_KEY` or `AZURE_CONNECTION_STRING` | key/connection string from Key Vault |

Public buckets give plain URLs (`MEDIA_PUBLIC=1`, default); private buckets use signed, expiring URLs (`MEDIA_PUBLIC=0`).
Adding another provider means one branch in `web_application/storage.py`.

## Secrets: where they live
Nothing sensitive is committed. In CI and deploy workflows: Google authentication uses Workload Identity Federation (no key file), settings are repository *variables*, and secrets are mounted from the cloud secret manager by name. Tests run on a throwaway database container without any credentials and ignore all production variables.

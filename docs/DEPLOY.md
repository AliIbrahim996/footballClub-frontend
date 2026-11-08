# Deploying Pitchside

Two services: **web** (this repo, Next.js) and **api** (`footballClub-backend`, Django + PostgreSQL). The browser only talks to `web`;
`web` calls `api` server-side, so no CORS setup is needed and the login token never reaches JavaScript.

```
browser ──► web (Next.js, :3000) ──► api (Django, :8000) ──► PostgreSQL
                  └── /media/* rewritten to api (uploads)        └── uploads: disk or Google Cloud Storage
```

## Option A: one machine with Docker Compose (cheapest)
Works on a home PC / Raspberry Pi, an Oracle Cloud free VM, or a Google Cloud `e2-micro` (always-free in some US regions).
```bash
git clone <backend repo> footballClub-backend
git clone <frontend repo> footballclub-frontend && cd footballclub-frontend
docker compose --profile with-api up --build -d
```
Put HTTPS in front (needed for logins over the internet and for the Android app): a free **Cloudflare Tunnel** or Caddy/nginx with Let's Encrypt.
Then set `NEXT_PUBLIC_SITE_URL=https://your.domain`, `COOKIE_SECURE=1`, `DJANGO_DEBUG=0`, a real `DJANGO_SECRET_KEY`,
`DJANGO_ALLOWED_HOSTS`, and `SEED_DEMO_DATA=0`.

## Option B: Google Cloud Run (managed, scales to zero)
| Piece | Service | Cost note |
|---|---|---|
| web + api | Cloud Run (two services) | free tier, then pay per use; cold start after idle |
| Database | Neon / Supabase free Postgres, or Cloud SQL | Cloud SQL has no free tier (roughly $10+/month) |
| Uploads | Cloud Storage bucket (`GS_BUCKET_NAME`) | Cloud Run disks are ephemeral, so this is required |
| Images | Artifact Registry | small |

API env: `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS=<api host>`, `POSTGRES_HOST/DB/USER/PASSWORD`, `POSTGRES_SSLMODE=require`,
`GS_BUCKET_NAME`, `FRONTEND_URL`, plus Stripe/email variables below. Web env: `BACKEND_URL=https://<api host>`, `COOKIE_SECURE=1`.
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

## Before charging customers
- Privacy policy, terms, and (Germany) an imprint; GDPR applies, especially for youth players' data.
- Back up the database and bucket; set `DJANGO_DEBUG=0`, rotate the demo admin password, turn off `SEED_DEMO_DATA`.
- One trial per club is enforced by unique email; determined users can still use new emails, so watch for abuse.

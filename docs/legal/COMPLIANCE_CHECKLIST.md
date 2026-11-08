# Legal and GDPR launch checklist

The pages `/privacy`, `/terms` and `/imprint` and the data processing agreement (DPA) templates in this folder are **drafts that match what the software actually does**. They are not legal advice: have a lawyer or a data protection professional review them before you take real clubs. Rules here are German/EU; other countries differ.

## 1. Before the site goes public
- [ ] Set the `NEXT_PUBLIC_LEGAL_*` variables (see `.env.example`): name incl. legal form, a postal address where you can be served, email, phone (or working contact form), VAT ID / register entry / representative if they apply, hosting provider. The imprint is mandatory for a German business-like site (section 5 DDG) and must be reachable from every page in two clicks (it is linked in the footer). Pages with missing details show a warning and are `noindex` until complete.
- [ ] Fill the **hosting** value with the real provider(s) so the privacy policy names them.
- [ ] Re-read `src/content/legal/de.ts` (binding version) against your real setup: hosting, e-mail provider, whether Stripe/AdSense are on. Update `LEGAL_VERSION` in `src/lib/legal.ts` when the terms or privacy policy change materially. Sign-ups store which version was accepted.
- [ ] Decide **consumer vs business**: the terms are written for clubs/organisations. If individuals can sign up as private persons you also need consumer information (withdrawal right, price indication, cancellation button for online contracts). Ask your lawyer.
- [ ] If you sell: price display, VAT handling (a merchant of record such as Paddle/Lemon Squeezy simplifies this), invoices.
- [ ] Ads: AdSense needs a **certified consent platform (TCF)** for EU/UK visitors. The built-in banner is a minimal stand-in. Replace it before enabling ads.

## 2. Youth players' data (the sensitive part)
- [ ] **The club is the controller, you are the processor.** Sign the DPA (`DATA_PROCESSING_AGREEMENT.de.md`) with every club *before* they enter player data. Keep the signed copies.
- [ ] Tell clubs plainly (onboarding mail / terms already say it): they need a legal basis, must inform players and parents, and need **parental consent for minors**, especially for **photos** (publication/processing of images of children).
- [ ] Encourage data minimisation: only what the club needs. Do not collect health data (the DPA excludes it); avoid free-text notes about children's health or behaviour.
- [ ] Ads and share links: free pages never show player data. Shared plan links show only the board image and title: remind clubs not to put children's full names on shared boards.
- [ ] Decide a **deletion process**: when a club leaves, export on request then delete data, uploads and backups within the DPA period. (There is no self-service "delete my club" button yet; today it is a manual admin task. Build it before you have many clubs.)
- [ ] Data subject requests (access, rectification, erasure) from players/parents are answered by the **club**; you assist. Decide who in your team handles the assistance requests and how fast.

## 3. Your own records and security
- [ ] **Record of processing activities** as controller (website, contact form, club accounts) *and* as processor (club data), Art. 30.
- [ ] **TOMs**: complete Annex 1 of the DPA with what you really run (backups, access, patching). Keep secrets out of the repository (already enforced by settings and CI).
- [ ] **Sub-processor contracts (DPAs)** with hosting, database, storage, e-mail, Stripe; fill Annex 2. Check data locations and SCCs for non-EU providers.
- [ ] **Breach plan**: you must tell the club immediately; the club then has 72 hours to notify the authority (Art. 33). Write down who does what.
- [ ] **Data protection officer**: required in Germany if 20+ people regularly handle personal data automatically (section 38 BDSG), or for certain core activities. Probably not you alone; check.
- [ ] **DPIA**: large-scale processing of children's data can need one. Ask your adviser; for a small multi-club tool with minimal data it is usually not required, but document the reasoning.
- [ ] Backups are personal data too: define retention so deletion really completes.

## 4. What the software does today (and the gaps)
| Done | Gap / manual |
|---|---|
| Per-club data separation, role-based access, hashed passwords, HTTPS-ready, sign-in rate limits | No audit log of who *viewed* data |
| Terms acceptance + version recorded at sign-up; privacy policy, terms, imprint in 3 languages | Legal texts are drafts; imprint needs your real details |
| Designer data stays in the browser; contact messages stored with honeypot + rate limit | No automatic deletion of old contact messages (delete via Django admin) |
| Cookie/ad consent before ads load, "Cookie settings" link in footer | Banner is not a TCF-certified CMP |
| Owner can delete players; export/delete per club by request | No self-service club export / deletion yet |

## 5. Quick answers to common questions
- **Do I need a cookie banner?** For the strictly necessary cookie/local storage used today (sign-in, language, saved board) no consent is needed, but they must be described in the privacy policy (done). Ads or analytics need consent first.
- **Is the imprint needed for a free tool?** If the site is run in a business-like way (ads, a paid product, a company) in Germany: yes.
- **Can clubs enter photos of children?** Only with the legal basis/consent the club has obtained. Pitchside only stores what the club uploads.

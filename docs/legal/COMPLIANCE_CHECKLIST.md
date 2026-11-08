# Legal and privacy launch checklist

The pages `/privacy`, `/terms` and `/imprint` (provider information) in English and Arabic, and the data processing agreement (DPA) template in this folder, are **drafts that match what the software actually does**. They are not legal advice: have a lawyer or a data protection professional review them before you take real clubs or earn money. Rules differ by country, so check the ones that apply to you and to your visitors.

## 0. A personal demo / portfolio project
If you are **not earning money** (no ads, no paid plan) and use the site to show your work, set `NEXT_PUBLIC_LEGAL_DEMO=1`. The provider notice then says it is a non-commercial personal project and no street address is required (name, city and an email are enough). Keep ads and billing switched off. When you start earning, turn demo mode off and complete the provider details. The privacy policy and terms stay in place either way: the contact form and the designer still handle visitors' data.

## 1. Before the site goes public
- [ ] Set the `NEXT_PUBLIC_LEGAL_*` variables (see `.env.example`): name, city, country, contact email, phone if you want it shown, and registration / tax numbers only if they apply. Pages with missing details show a warning and are `noindex` until complete.
- [ ] Set the **hosting** value to the real provider(s) so the privacy policy names them.
- [ ] Re-read `src/content/legal/en.ts` and `ar.ts` against your real setup: hosting, e-mail provider, whether Stripe or AdSense are on. Update `LEGAL_VERSION` in `src/lib/legal.ts` when the terms or privacy policy change materially. Sign-ups store which version was accepted.
- [ ] Review the **governing-law** clause of the terms (currently the laws of Dubai and the UAE federal laws applicable there).
- [ ] If you sell: price display, tax handling, invoices. A merchant of record such as Paddle or Lemon Squeezy can take over sales tax.
- [ ] Ads: AdSense needs a **certified consent platform (TCF)** for visitors in the EU/UK. The built-in banner is a minimal stand-in. Replace it before enabling ads.
- [ ] Operators outside the EU serving people in the EU may need an **EU representative** (GDPR Art. 27). Set `NEXT_PUBLIC_LEGAL_EU_REPRESENTATIVE` if you appoint one. Also check your home-country rules (for the UAE: the Federal Personal Data Protection Law, and any trade-licence display duty for commercial sites; the licence number can go in `LEGAL_REGISTER`).

## 2. Youth players' data (the sensitive part)
- [ ] **The club decides what is stored; you process it for them.** Sign the DPA (`DATA_PROCESSING_AGREEMENT.en.md`) with every club *before* they enter player data. Keep the signed copies.
- [ ] Tell clubs plainly (the terms already say it): they need a legal basis, must inform players and parents, and need **parental consent for minors**, especially for **photos**.
- [ ] Encourage data minimisation: only what the club needs. Do not collect health data (the DPA excludes it); avoid free-text notes about children's health or behaviour.
- [ ] Free pages never show player data. Shared plan links show only the board image and title: remind clubs not to put children's full names on shared boards.
- [ ] Decide a **deletion process**: when a club leaves, export on request then delete data, uploads and backups within the DPA period. (There is no self-service "delete my club" button yet; today it is a manual admin task. Build it before you have many clubs.)
- [ ] Requests from players or parents (access, correction, deletion) are answered by the **club**; you assist. Decide who handles that and how fast.

## 3. Your own records and security
- [ ] A **record of processing activities** for the website, the contact form, club accounts and the club data you process.
- [ ] **Security measures:** complete Annex 1 of the DPA with what you really run (backups, access, patching). Keep secrets out of the repository (already enforced by settings and CI).
- [ ] **Contracts with providers** (hosting, database, storage, e-mail, Stripe); fill Annex 2. Check where each stores data.
- [ ] A **breach plan**: tell the club immediately so it can notify its authority in time. Write down who does what.
- [ ] Backups are personal data too: define retention so deletion really completes.

## 4. What the software does today (and the gaps)
| Done | Gap / manual |
|---|---|
| Per-club data separation, role-based access, hashed passwords, HTTPS-ready, sign-in rate limits | No audit log of who *viewed* data |
| Terms acceptance + version recorded at sign-up; privacy policy, terms and provider notice in English and Arabic | Legal texts are drafts |
| Designer data stays in the browser; contact messages stored with honeypot + rate limit | No automatic deletion of old contact messages (delete via Django admin) |
| Cookie/ad consent before ads load, "Cookie settings" link in footer | Banner is not a TCF-certified consent platform |
| Owner can delete players; export/delete per club by request | No self-service club export / deletion yet |

## 5. Quick answers
- **Do I need a cookie banner?** The strictly necessary cookie and local storage used today (sign-in, language, saved board) are described in the privacy policy (done). Ads or analytics need consent first.
- **Can clubs enter photos of children?** Only with the legal basis and consent the club has obtained. Pitchside only stores what the club uploads.

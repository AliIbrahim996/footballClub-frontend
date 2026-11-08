// Builds the public site + free designer as plain static files (out/) for GitHub Pages or any static host.
//
// The full app (login, club management, API proxy) needs a server and is NOT part of this build: this script
// copies the project to a temporary folder, deletes everything that needs a server, and runs `next build` with
// STATIC_EXPORT=1. Your working tree is never modified.
//
//   NEXT_PUBLIC_SITE_URL       public URL incl. sub-path, e.g. https://user.github.io/repo  (or https://your.domain)
//   NEXT_PUBLIC_BASE_PATH      sub-path only, e.g. /repo  (empty for a custom domain or a user/organisation site)
//   NEXT_PUBLIC_CONTACT_EMAIL  shown on the contact page (mailto)
//   NEXT_PUBLIC_LEGAL_*        operator details for imprint / privacy policy
//   ADSENSE_PUB_ID             optional: writes out/ads.txt
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
// Outside the repository on purpose: inside it, the bundler finds the repo's own lockfile, src/ and proxy.ts and builds those instead.
const work = mkdtempSync(path.join(os.tmpdir(), "pitchside-static-"));
const out = path.join(root, "out");
rmSync(out, { recursive: true, force: true });

// Copy only what the build needs (cpSync cannot copy a folder into its own subfolder anyway).
for (const entry of ["src", "public", "messages", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "package.json", "package-lock.json"]) {
  if (existsSync(path.join(root, entry))) cpSync(path.join(root, entry), path.join(work, entry), { recursive: true });
}
// A real install (not a symlink to ../node_modules): the bundler refuses to follow links that leave the project root.
const install = spawnSync("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: work, stdio: "inherit", shell: true });
if (install.status !== 0) { rmSync(work, { recursive: true, force: true }); process.exit(install.status ?? 1); }

// Everything below needs a server (cookies, API calls, middleware, per-request data).
const server = [
  "src/proxy.ts", "src/app/api", "src/app/ads.txt",
  "src/app/[locale]/(app)", "src/app/[locale]/login", "src/app/[locale]/register", "src/app/[locale]/join",
  "src/app/[locale]/(marketing)/shared",
];
for (const p of server) rmSync(path.join(work, p), { recursive: true, force: true });

const env = {
  ...process.env,
  STATIC_EXPORT: "1",
  NEXT_PUBLIC_DESIGNER_ONLY: "1",
  NEXT_PUBLIC_SIGNUPS_OPEN: "0",
  NEXT_PUBLIC_CONTACT_MODE: "mailto",
  NEXT_TELEMETRY_DISABLED: "1",
};
const build = spawnSync(process.execPath, [path.join(work, "node_modules/next/dist/bin/next"), "build"], { cwd: work, env, stdio: "inherit" });
if (build.status !== 0) { rmSync(work, { recursive: true, force: true }); process.exit(build.status ?? 1); }

cpSync(path.join(work, "out"), out, { recursive: true });

const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
// "/" has no page of its own (locale prefixes are required): send visitors to their language.
writeFileSync(
  path.join(out, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pitchside</title><meta name="robots" content="noindex">
<link rel="canonical" href="${base}/en/">
<script>
var l=(navigator.languages&&navigator.languages[0]||navigator.language||"en").slice(0,2).toLowerCase();
location.replace("${base}/"+(["de","ar"].indexOf(l)>-1?l:"en")+"/");
</script>
<noscript><meta http-equiv="refresh" content="0; url=${base}/en/"></noscript></head>
<body><p><a href="${base}/en/">English</a> · <a href="${base}/de/">Deutsch</a> · <a href="${base}/ar/">العربية</a></p></body></html>`,
);
writeFileSync(path.join(out, ".nojekyll"), ""); // GitHub Pages must not run Jekyll over the _next folder
if (process.env.ADSENSE_PUB_ID) {
  writeFileSync(path.join(out, "ads.txt"), `google.com, ${process.env.ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0\n`);
}
rmSync(work, { recursive: true, force: true });
console.log(`\nStatic site ready in ${path.relative(root, out)}/ (${existsSync(path.join(out, "en", "index.html")) ? "ok" : "missing en/index.html"})`);

import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android wrapper: a thin shell that loads the hosted site, so the app, login and data are the same as on the web
 * and updates ship without a new APK. Set APP_URL to your public HTTPS address when building.
 * (AdSense is not allowed inside app WebViews; ads on this site stay web-only.)
 */
const config: CapacitorConfig = {
  appId: "app.pitchside.club",
  appName: "Pitchside",
  webDir: "capacitor-www", // placeholder page, only shown if the server URL is unreachable
  server: { url: process.env.APP_URL ?? "https://example.invalid", cleartext: false },
  android: { allowMixedContent: false },
};

export default config;

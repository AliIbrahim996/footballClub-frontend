// Build-time switches (NEXT_PUBLIC_* are inlined into the bundle, so set them as Docker build args / host build env).

/** Self-service sign-up and the free trial. Off = visitors use the "contact us" form to ask for the full version. */
export const SIGNUPS_OPEN = process.env.NEXT_PUBLIC_SIGNUPS_OPEN === "1";

/** Free hosting mode: only the public pages and the free designer; hides sign-in links (no backend needed). */
export const DESIGNER_ONLY = process.env.NEXT_PUBLIC_DESIGNER_ONLY === "1";

/** "form" posts to the API (stored + e-mailed); "mailto" needs no backend and just opens the visitor's mail app. */
export const CONTACT_MODE: "form" | "mailto" = process.env.NEXT_PUBLIC_CONTACT_MODE === "form" ? "form" : "mailto";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

/**
 * Prices are shown only once sign-ups are open, and never as a made-up euro amount. Provide a label per language, e.g.
 * NEXT_PUBLIC_PRICES='{"en":"AED 35 / month","ar":"35 درهم / شهر"}'. A visitor's country is not known to a static
 * site, so pick labels per language; for real per-country currencies use Stripe's multi-currency prices at checkout.
 */
export const PRICE_CURRENCY = process.env.NEXT_PUBLIC_PRICE_CURRENCY || "AED"; // for structured data only
const PRICES: Record<string, string> = (() => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_PRICES || "{}");
  } catch {
    return {};
  }
})();
export const priceLabel = (locale: string): string | undefined => PRICES[locale];

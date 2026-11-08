// Operator identity for the legal pages. Everything comes from build-time variables so no personal data is committed.
// An imprint is legally required (Germany: section 5 DDG) and must name the real provider: fill these in before launch.
const v = (name: string) => (process.env[name] ?? "").trim();

export const LEGAL_VERSION = "2026-11-09"; // bump when the terms or privacy policy change materially (stored on sign-up)

export const LEGAL = {
  name: v("NEXT_PUBLIC_LEGAL_NAME"), // person or company, including legal form (e.g. "Jane Doe" or "Example UG (haftungsbeschraenkt)")
  street: v("NEXT_PUBLIC_LEGAL_STREET"),
  city: v("NEXT_PUBLIC_LEGAL_CITY"), // postcode and city
  country: v("NEXT_PUBLIC_LEGAL_COUNTRY") || "Germany",
  email: v("NEXT_PUBLIC_LEGAL_EMAIL") || v("NEXT_PUBLIC_CONTACT_EMAIL"),
  phone: v("NEXT_PUBLIC_LEGAL_PHONE"),
  vatId: v("NEXT_PUBLIC_LEGAL_VAT_ID"), // USt-IdNr., if you have one
  register: v("NEXT_PUBLIC_LEGAL_REGISTER"), // commercial register court and number, if registered
  representative: v("NEXT_PUBLIC_LEGAL_REPRESENTATIVE"), // managing director(s) for companies
  euRepresentative: v("NEXT_PUBLIC_LEGAL_EU_REPRESENTATIVE"), // GDPR Art. 27: needed if the operator is outside the EU/EEA and serves people in the EU
  hosting: v("NEXT_PUBLIC_LEGAL_HOSTING"), // hosting provider(s), e.g. "Render Services, Inc., San Francisco, USA"
};

/** True once the minimum an imprint needs is present: who you are, where you can be served, how to reach you. */
export const legalComplete = Boolean(LEGAL.name && LEGAL.street && LEGAL.city && LEGAL.email);

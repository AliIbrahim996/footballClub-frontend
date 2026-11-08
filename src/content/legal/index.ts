import type { Locale } from "@/i18n/routing";
import { ar } from "./ar";
import { en } from "./en";
import type { LegalLang } from "./types";

export const LEGAL_CONTENT: Record<Locale, () => LegalLang> = { en, ar };

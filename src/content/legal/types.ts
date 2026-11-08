import { LEGAL } from "@/lib/legal";

export type LegalSection = { h: string; p?: string[]; ul?: string[] };
export type LegalDoc = { title: string; intro?: string[]; sections: LegalSection[] };
export type LegalLang = { updated: string; note?: string; privacy: LegalDoc; terms: LegalDoc; imprint: LegalDoc };

/** Placeholder shown where the operator has not configured a value yet. */
export const TBD = "[to be completed]";
export const val = (s: string) => s || TBD;

export const operatorLines = () => [val(LEGAL.name), val(LEGAL.street), val(LEGAL.city), val(LEGAL.country)];
export const contactEmail = () => val(LEGAL.email);

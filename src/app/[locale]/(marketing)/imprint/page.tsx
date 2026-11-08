import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, legalMetadata } from "@/components/legal-page";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  return legalMetadata("imprint", (await params).locale);
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage kind="imprint" locale={locale} />;
}
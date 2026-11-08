import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui";
import { CONTACT_EMAIL, CONTACT_MODE } from "@/lib/flags";
import { alternates } from "@/lib/seo";
import { ContactForm } from "./contact-form";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternates(locale, "/contact") };
}

export default async function ContactPage({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const useForm = CONTACT_MODE === "form";
  const subject = encodeURIComponent(t("mailSubject"));

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 md:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-balance">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted">{t("intro")}</p>
      <div className="mt-8">
        {useForm ? (
          <Suspense><ContactForm locale={locale} prefill={t("prefill")} /></Suspense>
        ) : CONTACT_EMAIL ? (
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-muted">{t("mailtoBody")}</p>
            <LinkButton href={`mailto:${CONTACT_EMAIL}?subject=${subject}`} className="mt-4" prefetch={false}>
              <Mail size={16} aria-hidden /> {CONTACT_EMAIL}
            </LinkButton>
          </div>
        ) : (
          <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">{t("notConfigured")}</p>
        )}
      </div>
    </section>
  );
}

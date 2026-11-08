import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui";
import { alternates } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "featuresPage" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternates(locale, "/features") };
}

const SECTIONS = ["squad", "ratings", "board", "plans"] as const;

export default async function FeaturesPage({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("featuresPage");
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-balance">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted">{t("intro")}</p>
      {SECTIONS.map((k) => (
        <section key={k} className="mt-12" aria-labelledby={`f-${k}`}>
          <h2 id={`f-${k}`} className="text-2xl font-semibold tracking-tight">{t(`${k}.title`)}</h2>
          <p className="mt-3 text-muted">{t(`${k}.body`)}</p>
          <ul className="mt-4 list-disc space-y-1.5 ps-5 text-sm">
            {(t.raw(`${k}.points`) as string[]).map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      ))}
      <LinkButton href="/login" className="mt-14 h-12 px-8 text-base">{t("cta")}</LinkButton>
    </article>
  );
}

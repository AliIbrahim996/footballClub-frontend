import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdSlot } from "@/components/ads";
import { PublicDesigner } from "@/components/board/public-designer";
import { LinkButton } from "@/components/ui";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { absolute, alternates } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "designer" });
  return { title: t("metaTitle"), description: t("metaDescription"), alternates: alternates(locale, "/designer") };
}

const POINTS = ["fields", "draw", "formations", "export"] as const;

export default async function DesignerPage({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("designer");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"), description: t("metaDescription"), applicationCategory: "SportsApplication", operatingSystem: "Web",
    url: absolute(`/${locale}/designer`), offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t("intro")}</p>
        <div className="mt-6"><PublicDesigner placeholder={t("loading")} /></div>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DESIGNER} />
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t("whyTitle")}</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-muted">
              {POINTS.map((k) => <li key={k}>{t(`points.${k}`)}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-xl font-semibold">{t("upgradeTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{SIGNUPS_OPEN ? t("upgradeBody") : t("upgradeBodyClosed")}</p>
            <LinkButton href={SIGNUPS_OPEN ? "/register" : "/contact?topic=full"} className="mt-5">{SIGNUPS_OPEN ? t("upgradeCta") : t("upgradeCtaClosed")}</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}

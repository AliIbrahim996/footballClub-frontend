import type { Metadata } from "next";
import { ClipboardList, Languages, Route, Star, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui";
import { absolute, alternates } from "@/lib/seo";
import { SITE } from "@/lib/site";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("title") }, description: t("description"), alternates: alternates(locale) };
}

const FEATURES = [
  { key: "squad", icon: Users }, { key: "ratings", icon: Star }, { key: "board", icon: Route },
  { key: "plans", icon: ClipboardList }, { key: "languages", icon: Languages },
] as const;
const FAQ = ["cost", "who", "board", "data", "languages"] as const;

function HeroPitch() {
  return (
    <svg viewBox="0 0 520 340" role="img" aria-label="Tactics board preview" className="w-full rounded-2xl border border-line shadow-sm">
      <rect width="520" height="340" fill="#2f7d3a" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 65} width="65" height="340" fill={i % 2 ? "#33853f" : "#2f7d3a"} />)}
      <g fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2">
        <rect x="10" y="10" width="500" height="320" /><path d="M260 10v320" /><circle cx="260" cy="170" r="45" />
        <rect x="10" y="85" width="80" height="170" /><rect x="430" y="85" width="80" height="170" />
      </g>
      {[[50, 170], [130, 70], [130, 135], [130, 205], [130, 270], [220, 90], [220, 250], [300, 170], [380, 100], [380, 240]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="14" fill="#2563eb" stroke="#fff" strokeWidth="2.5" />
          <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="700">{i + 1}</text></g>
      ))}
      {[[390, 60], [440, 130], [440, 210], [330, 290]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="14" fill="#dc2626" stroke="#fff" strokeWidth="2.5" />)}
      <path d="M300 170 L395 105" stroke="#fde047" strokeWidth="3" strokeDasharray="9 7" fill="none" strokeLinecap="round" />
      <path d="M220 90 L370 100" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="372" cy="100" r="6" fill="#fff" />
    </svg>
  );
}

export default async function LandingPage({ params }: P) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const meta = await getTranslations("meta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": absolute("/#org"), name: SITE.name, url: absolute(`/${locale}`) },
      {
        "@type": "SoftwareApplication", name: SITE.name, applicationCategory: "SportsApplication", operatingSystem: "Web",
        description: meta("description"), inLanguage: ["en", "de", "ar"], url: absolute(`/${locale}`),
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        featureList: FEATURES.map((f) => t(`features.${f.key}.title`)),
      },
      {
        "@type": "FAQPage", inLanguage: locale,
        mainEntity: FAQ.map((k) => ({ "@type": "Question", name: t(`faq.${k}.q`), acceptedAnswer: { "@type": "Answer", text: t(`faq.${k}.a`) } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2">
        <div className="rise">
          <p className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">{t("hero.badge")}</p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">{t("hero.title")}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted text-pretty">{t("hero.body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/login" className="h-12 px-6 text-base">{t("hero.cta")}</LinkButton>
            <LinkButton href="/features" variant="secondary" className="h-12 px-6 text-base">{t("hero.secondary")}</LinkButton>
          </div>
        </div>
        <div className="rise" style={{ animationDelay: "120ms" }}><HeroPitch /></div>
      </section>

      <section aria-labelledby="features" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="features" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance">{t("features.title")}</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon size={22} className="text-accent" aria-hidden />
                <h3 className="mt-3 font-semibold">{t(`features.${key}.title`)}</h3>
                <p className="mt-1.5 text-sm text-muted">{t(`features.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 id="how" className="text-3xl font-semibold tracking-tight">{t("how.title")}</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {(["one", "two", "three"] as const).map((k, i) => (
            <li key={k} className="rounded-2xl border border-line bg-surface p-6">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{t(`how.${k}.title`)}</h3>
              <p className="mt-1.5 text-sm text-muted">{t(`how.${k}.body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 id="faq" className="text-3xl font-semibold tracking-tight">{t("faq.title")}</h2>
          <dl className="mt-8 divide-y divide-line">
            {FAQ.map((k) => (
              <div key={k} className="py-5">
                <dt className="font-medium">{t(`faq.${k}.q`)}</dt>
                <dd className="mt-1.5 text-sm text-muted">{t(`faq.${k}.a`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance">{t("cta.title")}</h2>
        <LinkButton href="/login" className="mt-8 h-12 px-8 text-base">{t("hero.cta")}</LinkButton>
      </section>
    </>
  );
}

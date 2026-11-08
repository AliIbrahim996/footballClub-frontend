import type { Metadata } from "next";
import { LEGAL_CONTENT } from "@/content/legal";
import type { Locale } from "@/i18n/routing";
import { legalComplete } from "@/lib/legal";
import { alternates } from "@/lib/seo";

export type LegalKind = "privacy" | "terms" | "imprint";

export function legalMetadata(kind: LegalKind, locale: string): Metadata {
  const doc = LEGAL_CONTENT[locale as Locale]()[kind];
  return {
    title: doc.title,
    alternates: alternates(locale, `/${kind}`),
    // Do not let search engines index an imprint that still has placeholders.
    robots: legalComplete ? undefined : { index: false, follow: true },
  };
}

export function LegalPage({ kind, locale }: { kind: LegalKind; locale: string }) {
  const lang = LEGAL_CONTENT[locale as Locale]();
  const doc = lang[kind];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-2 text-sm text-muted">{lang.updated}</p>
      {lang.note && <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm">{lang.note}</p>}
      {!legalComplete && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          Operator details are not configured. Set the NEXT_PUBLIC_LEGAL_* variables before publishing this site.
        </p>
      )}
      {doc.intro?.map((p) => <p key={p} className="mt-5 text-muted">{p}</p>)}
      {doc.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
          {s.p?.map((p) => <p key={p} className="mt-2 text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">{p}</p>)}
          {s.ul && (
            <ul className="mt-2 list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-muted">
              {s.ul.map((li) => <li key={li} className="[overflow-wrap:anywhere]">{li}</li>)}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ConsentBanner } from "@/components/ads";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { LinkButton, Logo } from "@/components/ui";
import { DESIGNER_ONLY, SIGNUPS_OPEN } from "@/lib/flags";

export default async function MarketingLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("landing");
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg">{t("skip")}</a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="Pitchside"><Logo /></Link>
          <nav aria-label={t("nav.label")} className="flex items-center gap-1 sm:gap-2">
            <Link href="/designer" className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-muted hover:text-fg sm:inline-flex">{t("nav.designer")}</Link>
            <Link href="/features" className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-muted hover:text-fg md:inline-flex">{t("nav.features")}</Link>
            <LocaleSwitcher />
            {/* wrapper hides it on phones: LinkButton's own display class would beat a `hidden` passed in */}
            {!DESIGNER_ONLY && <span className="hidden sm:inline-flex"><LinkButton href="/login" variant="secondary" className="h-10">{t("nav.signIn")}</LinkButton></span>}
            <LinkButton href={SIGNUPS_OPEN ? "/register" : "/contact"} variant="primary" className="h-10">{SIGNUPS_OPEN ? t("nav.trial") : t("nav.contact")}</LinkButton>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <ConsentBanner />
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted">{t("footer.blurb")}</p>
          </div>
          <nav aria-label={t("footer.label")} className="flex flex-wrap gap-x-8 gap-y-2 text-sm md:justify-end">
            <Link href="/designer" className="text-muted hover:text-fg">{t("nav.designer")}</Link>
            <Link href="/features" className="text-muted hover:text-fg">{t("nav.features")}</Link>
            <Link href="/contact" className="text-muted hover:text-fg">{t("nav.contact")}</Link>
            {!DESIGNER_ONLY && <Link href="/login" className="text-muted hover:text-fg">{t("nav.signIn")}</Link>}
            <a href="/llms.txt" className="text-muted hover:text-fg">llms.txt</a>
            <a href="/sitemap.xml" className="text-muted hover:text-fg">Sitemap</a>
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted sm:px-6">© {new Date().getFullYear()} Pitchside</p>
      </footer>
    </>
  );
}

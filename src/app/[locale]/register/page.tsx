import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/ui";
import { alternates } from "@/lib/seo";
import { RegisterForm } from "./register-form";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });
  return { title: t("title"), description: t("subtitle"), alternates: alternates(locale, "/register") };
}

export default async function RegisterPage({ params }: P) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("register");
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/"><Logo /></Link>
            <LocaleSwitcher />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mb-8 mt-1 text-sm text-muted">{t("subtitle")}</p>
          <RegisterForm />
          <p className="mt-6 text-sm text-muted">{t("haveAccount")} <Link href="/login" className="font-medium text-accent underline underline-offset-4">{t("signIn")}</Link></p>
        </div>
      </section>
      <aside aria-hidden className="relative hidden overflow-hidden bg-[var(--pitch)] lg:block">
        <svg viewBox="0 0 400 600" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3">
            <rect x="30" y="30" width="340" height="540" /><path d="M30 300h340" /><circle cx="200" cy="300" r="55" />
            <rect x="100" y="30" width="200" height="90" /><rect x="100" y="480" width="200" height="90" />
          </g>
        </svg>
      </aside>
    </main>
  );
}

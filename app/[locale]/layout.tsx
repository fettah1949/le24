import { Header } from "@/components/news/Header";
import { Footer } from "@/components/news/Footer";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { AdSlot } from "@/components/ads/AdSlot";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "ar" }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} dict={dict}>
      <div className={`flex min-h-screen flex-col ${locale === "ar" ? "font-arabic" : ""}`}>
        <Header locale={locale} dict={dict} />
        <div className="container-main py-1.5 sm:py-2">
          <AdSlot slot="header-banner" label={dict.ads.label} />
        </div>
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </div>
    </I18nProvider>
  );
}

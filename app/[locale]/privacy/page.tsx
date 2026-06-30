import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getIntlLocale } from "@/lib/i18n/config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return { title: "Not found" };
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  return buildMetadata({
    locale,
    pathWithoutLocale: "/privacy",
    title: dict.privacy.title,
    description: dict.privacy.collectText,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="container-main py-12 max-w-3xl">
      <h1 className="text-4xl font-bold">{dict.privacy.title}</h1>
      <div className="mt-8 prose-article">
        <p>
          {dict.privacy.updated}{" "}
          {new Date().toLocaleDateString(getIntlLocale(locale))}
        </p>
        <h2>{dict.privacy.collectTitle}</h2>
        <p>{dict.privacy.collectText}</p>
        <h2>{dict.privacy.useTitle}</h2>
        <p>{dict.privacy.useText}</p>
        <h2>{dict.privacy.rightsTitle}</h2>
        <p>{dict.privacy.rightsText}</p>
      </div>
    </div>
  );
}

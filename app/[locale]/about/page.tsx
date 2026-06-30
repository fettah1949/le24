import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

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
    pathWithoutLocale: "/about",
    title: `${dict.about.title} — ${getSiteName()}`,
    description: dict.about.missionText,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="container-main py-12 max-w-3xl">
      <h1 className="text-4xl font-bold">{dict.about.title}</h1>
      <div className="mt-8 prose-article">
        <p>{dict.footer.description}</p>
        <h2>{dict.about.missionTitle}</h2>
        <p>{dict.about.missionText}</p>
        <h2>{dict.about.valuesTitle}</h2>
        <ul>
          {dict.about.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

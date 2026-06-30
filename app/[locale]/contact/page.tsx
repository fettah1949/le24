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
    pathWithoutLocale: "/contact",
    title: `${dict.contact.title} — ${getSiteName()}`,
    description: dict.contact.intro,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const dict = await getDictionary(localeParam as Locale);
  const site = getSiteName().toLowerCase();

  return (
    <div className="container-main py-12 max-w-3xl">
      <h1 className="text-4xl font-bold">{dict.contact.title}</h1>
      <p className="mt-4 text-news-muted">{dict.contact.intro}</p>
      <div className="mt-8 space-y-4">
        <div className="rounded-lg border border-news-border bg-white p-6">
          <h2 className="font-semibold">{dict.contact.editorial}</h2>
          <p className="mt-1 text-sm text-news-muted">redaction@{site}.com</p>
        </div>
        <div className="rounded-lg border border-news-border bg-white p-6">
          <h2 className="font-semibold">{dict.contact.advertising}</h2>
          <p className="mt-1 text-sm text-news-muted">pub@{site}.com</p>
        </div>
      </div>
    </div>
  );
}

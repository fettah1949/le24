import type { Metadata } from "next";
import { SearchBar } from "@/components/news/SearchBar";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Pagination } from "@/components/news/Pagination";
import { SectionHeading } from "@/components/news/SectionHeading";
import { searchArticles } from "@/lib/queries/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const { q } = await searchParams;
  if (!isValidLocale(localeParam)) return { title: "Not found" };
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  return buildMetadata({
    locale,
    pathWithoutLocale: "/search",
    queryString: q ? `?q=${encodeURIComponent(q)}` : undefined,
    title: q ? `${dict.search.title}: ${q}` : dict.search.title,
    description: dict.search.placeholder,
    noIndex: true,
  });
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params;
  const { q, page: pageParam } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  const query = q?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const results =
    query.length >= 2
      ? await searchArticles(query, page)
      : { articles: [], total: 0, pages: 0 };

  return (
    <div className="container-main py-8">
      <SectionHeading title={dict.search.title} />

      <div className="max-w-xl mb-8">
        <SearchBar />
      </div>

      {query.length < 2 ? (
        <p className="text-news-muted">{dict.search.minChars}</p>
      ) : results.articles.length === 0 ? (
        <p className="text-news-muted">
          {dict.search.noResults} &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          <p className="mb-6 text-sm text-news-muted">
            {results.total} {dict.search.results}
            {results.total > 1 && locale === "fr" ? "s" : ""} — &ldquo;{query}&rdquo;
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={results.pages}
            basePath={`${localizedPath(locale, "/search")}?q=${encodeURIComponent(query)}`}
            dict={dict}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}

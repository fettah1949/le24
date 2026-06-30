import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/news/Breadcrumbs";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Pagination } from "@/components/news/Pagination";
import { SectionHeading } from "@/components/news/SectionHeading";
import { getTagBySlug, getArticlesByTag } from "@/lib/queries/articles";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const { page: pageParam } = await searchParams;
  if (!isValidLocale(localeParam)) return { title: "Not found" };
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag non trouvé" };
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  return buildMetadata({
    locale,
    pathWithoutLocale: `/tag/${tag.slug}`,
    title: `#${tag.name}`,
    description: `${dict.tag.titlePrefix} ${tag.name}`,
    noIndex: page > 1,
  });
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const { page: pageParam } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const { articles, total, pages } = await getArticlesByTag(tag.id, page);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dict.breadcrumb.home, url: localizedPath(locale) },
          { name: `#${tag.name}`, url: localizedPath(locale, `/tag/${tag.slug}`) },
        ])}
      />

      <div className="container-main py-8">
        <Breadcrumbs
          items={[{ label: `#${tag.name}` }]}
          locale={locale}
          dict={dict}
          className="mb-6"
        />

        <SectionHeading
          title={`#${tag.name}`}
          subtitle={`${total} ${dict.home.articles}`}
        />

        {articles.length === 0 ? (
          <p className="text-news-muted">{dict.common.noArticles}</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
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
              totalPages={pages}
              basePath={localizedPath(locale, `/tag/${slug}`)}
              dict={dict}
              className="mt-10"
            />
          </>
        )}
      </div>
    </>
  );
}

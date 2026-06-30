import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/news/Breadcrumbs";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Pagination } from "@/components/news/Pagination";
import { SectionHeading } from "@/components/news/SectionHeading";
import {
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/queries/articles";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import { AdSlot } from "@/components/ads/AdSlot";

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
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Catégorie non trouvée" };

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  return buildMetadata({
    locale,
    pathWithoutLocale: `/category/${category.slug}`,
    title: `${category.name} — ${dict.category.titleSuffix}`,
    description:
      category.description ??
      `${category.name} — ${dict.category.titleSuffix}`,
    noIndex: page > 1,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const { page: pageParam } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { articles, total, pages } = await getArticlesByCategory(
    category.id,
    page
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dict.breadcrumb.home, url: localizedPath(locale) },
          {
            name: category.name,
            url: localizedPath(locale, `/category/${category.slug}`),
          },
        ])}
      />

      <div className="container-main py-8">
        <Breadcrumbs
          items={[{ label: category.name }]}
          locale={locale}
          dict={dict}
          className="mb-6"
        />

        <SectionHeading
          title={category.name}
          subtitle={
            category.description ??
            `${total} ${dict.home.articles}`
          }
        />

        <AdSlot slot="category-top" label={dict.ads.label} className="mb-8" />

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
              basePath={localizedPath(locale, `/category/${slug}`)}
              dict={dict}
              className="mt-10"
            />
          </>
        )}
      </div>
    </>
  );
}

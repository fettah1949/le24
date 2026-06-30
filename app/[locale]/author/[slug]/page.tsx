import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/news/Breadcrumbs";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Pagination } from "@/components/news/Pagination";
import { SectionHeading } from "@/components/news/SectionHeading";
import {
  getAuthorBySlug,
  getArticlesByAuthor,
} from "@/lib/queries/articles";
import {
  buildMetadata,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/metadata";
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
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Auteur non trouvé" };

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  return buildMetadata({
    locale,
    pathWithoutLocale: `/author/${author.slug}`,
    title: `${author.name} — ${dict.author.titleSuffix}`,
    description: author.bio ?? `${author.name}`,
    image: author.avatar,
    noIndex: page > 1,
  });
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const { page: pageParam } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const { articles, total, pages } = await getArticlesByAuthor(author.id, page);

  return (
    <>
      <JsonLd
        data={[
          buildPersonJsonLd(author, locale),
          buildBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, url: localizedPath(locale) },
            {
              name: author.name,
              url: localizedPath(locale, `/author/${author.slug}`),
            },
          ]),
        ]}
      />

      <div className="container-main py-8">
        <Breadcrumbs
          items={[{ label: author.name }]}
          locale={locale}
          dict={dict}
          className="mb-6"
        />

        <div className="flex items-start gap-6 mb-8">
          {author.avatar && (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{author.name}</h1>
            {author.bio && (
              <p className="mt-2 text-news-muted max-w-2xl">{author.bio}</p>
            )}
            <p className="mt-2 text-sm text-news-muted">
              {total} {dict.author.publishedCount}
            </p>
          </div>
        </div>

        <SectionHeading title={dict.common.articles} />

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
              basePath={localizedPath(locale, `/author/${slug}`)}
              dict={dict}
              className="mt-10"
            />
          </>
        )}
      </div>
    </>
  );
}

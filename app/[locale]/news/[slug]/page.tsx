import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/news/Breadcrumbs";
import { RelatedArticles } from "@/components/news/RelatedArticles";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/queries/articles";
import {
  buildMetadata,
  buildNewsArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, readingTime } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import { AdSlot } from "@/components/ads/AdSlot";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) return { title: "Not found" };
  const locale = localeParam as Locale;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: "Article non trouvé" };

  return buildMetadata({
    locale,
    pathWithoutLocale: `/news/${article.slug}`,
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? article.title,
    image: article.ogImage ?? article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authors: [article.author.name],
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  await incrementArticleViews(article.id);

  const related = await getRelatedArticles(article.id, article.categoryId, 4);

  const breadcrumbItems = [
    {
      label: article.category.name,
      href: `/category/${article.category.slug}`,
    },
    { label: article.title },
  ];

  const jsonLd = [
    buildNewsArticleJsonLd(article, locale),
    buildBreadcrumbJsonLd([
      { name: dict.breadcrumb.home, url: localizedPath(locale) },
      {
        name: article.category.name,
        url: localizedPath(locale, `/category/${article.category.slug}`),
      },
      {
        name: article.title,
        url: localizedPath(locale, `/news/${article.slug}`),
      },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="container-main py-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div>
        <Breadcrumbs
          items={breadcrumbItems}
          locale={locale}
          dict={dict}
          className="mb-6"
        />

        <header className="max-w-3xl">
          <Link
            href={localizedPath(locale, `/category/${article.category.slug}`)}
            className="text-sm font-semibold uppercase tracking-wider text-brand-600 hover:underline"
          >
            {article.category.name}
          </Link>

          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg text-news-muted leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-news-border pb-6 text-sm text-news-muted">
            <Link
              href={localizedPath(locale, `/author/${article.author.slug}`)}
              className="font-medium text-news-text hover:text-brand-600 transition-colors"
            >
              {article.author.name}
            </Link>
            <span>•</span>
            <time dateTime={article.publishedAt?.toISOString()}>
              {formatDate(article.publishedAt, locale)}
            </time>
            <span>•</span>
            <span>
              {readingTime(article.content)} {dict.article.minRead}
            </span>
            <span>•</span>
            <span>
              {article.views} {dict.article.views}
            </span>
          </div>
        </header>

        <AdSlot slot="article-top" label={dict.ads.label} className="mt-6" />

        {article.featuredImage && (
          <div className="relative mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-xl">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        <div
          className="prose-article mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />

        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 max-w-3xl">
            {article.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={localizedPath(locale, `/tag/${tag.slug}`)}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <AdSlot slot="article-bottom" label={dict.ads.label} className="mt-8" />

        <RelatedArticles articles={related} locale={locale} dict={dict} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <AdSlot slot="sidebar" label={dict.ads.label} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

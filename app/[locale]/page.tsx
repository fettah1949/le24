import { CategoryNav } from "@/components/news/CategoryNav";
import { ArticleCard } from "@/components/news/ArticleCard";
import { SectionHeading } from "@/components/news/SectionHeading";
import { BreakingNewsTicker } from "@/components/news/RelatedArticles";
import {
  getTopStories,
  getLatestNews,
  getBreakingNews,
  getTrendingArticles,
  getAllCategories,
} from "@/lib/queries/articles";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteName } from "@/lib/utils";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 60;

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
    pathWithoutLocale: "",
    title: `${getSiteName()} — ${dict.meta.siteTitle}`,
    description: dict.meta.siteDescription,
  });
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);

  const [topStories, latestNews, breakingNews, trending, categories] =
    await Promise.all([
      safeFetch(() => getTopStories(5), []),
      safeFetch(() => getLatestNews(12), []),
      safeFetch(() => getBreakingNews(5), []),
      safeFetch(() => getTrendingArticles(6), []),
      safeFetch(() => getAllCategories(), []),
    ]);

  const featured = topStories[0];
  const secondaryTop = topStories.slice(1, 4);

  return (
    <>
      <BreakingNewsTicker articles={breakingNews} locale={locale} dict={dict} />
      <CategoryNav categories={categories} locale={locale} dict={dict} />

      <div className="container-main py-5 sm:py-8">
        <section>
          <SectionHeading
            title={dict.home.topStories}
            subtitle={dict.home.topStoriesSub}
          />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {featured && (
              <div className="lg:col-span-2">
                <ArticleCard
                  article={featured}
                  variant="featured"
                  priority
                  locale={locale}
                  dict={dict}
                />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {secondaryTop.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                  locale={locale}
                  dict={dict}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 sm:mt-12">
          <SectionHeading title={dict.home.latestNews} />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {latestNews.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                priority={i < 3}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        </section>

        <AdSlot slot="home-mid" label={dict.ads.label} className="mt-8 sm:mt-12" />

        <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <SectionHeading
              title={dict.home.trending}
              subtitle={dict.home.trendingSub}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {trending.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                  locale={locale}
                  dict={dict}
                />
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <AdSlot slot="sidebar" label={dict.ads.label} className="lg:sticky lg:top-20" />
            <SectionHeading title={dict.home.categories} />
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={localizedPath(locale, `/category/${cat.slug}`)}
                    className="flex items-center justify-between rounded-lg border border-news-border bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-news-muted">
                      {cat._count.articles} {dict.home.articles}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}

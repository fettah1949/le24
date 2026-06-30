import Link from "next/link";
import { localizedPath } from "@/lib/i18n/paths";
import { ArticleCard } from "./ArticleCard";
import { SectionHeading } from "./SectionHeading";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import type { ArticleWithRelations } from "@/lib/queries/articles";

interface RelatedArticlesProps {
  articles: ArticleWithRelations[];
  locale: Locale;
  dict: Dictionary;
}

export function RelatedArticles({ articles, locale, dict }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-news-border pt-8">
      <SectionHeading title={dict.article.related} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>
    </section>
  );
}

export function BreakingNewsTicker({
  articles,
  locale,
  dict,
}: {
  articles: ArticleWithRelations[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-news-accent text-white">
      <div className="container-main flex items-center gap-4 py-2">
        <span className="flex-shrink-0 rounded bg-white/20 px-2 py-0.5 text-xs font-bold uppercase">
          {dict.article.breaking}
        </span>
        <div className="overflow-hidden">
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={localizedPath(locale, `/news/${article.slug}`)}
                className="text-sm font-medium hover:underline"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

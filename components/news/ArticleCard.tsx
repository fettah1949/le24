import Link from "next/link";
import Image from "next/image";
import { cn, formatRelativeDate } from "@/lib/utils";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import type { ArticleWithRelations } from "@/lib/queries/articles";

interface ArticleCardProps {
  article: ArticleWithRelations;
  locale: Locale;
  dict: Dictionary;
  variant?: "default" | "featured" | "compact" | "horizontal";
  priority?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  locale,
  dict,
  variant = "default",
  priority = false,
  className,
}: ArticleCardProps) {
  const newsHref = localizedPath(locale, `/news/${article.slug}`);
  const categoryHref = localizedPath(locale, `/category/${article.category.slug}`);

  if (variant === "featured") {
    return (
      <article className={cn("group relative overflow-hidden rounded-lg sm:rounded-xl", className)}>
        <Link href={newsHref} className="block">
          <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
            {article.featuredImage ? (
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                priority={priority}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              {article.isBreaking && (
                <span className="mb-2 inline-block rounded bg-news-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white sm:text-xs">
                  {dict.article.breaking}
                </span>
              )}
              <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/80 sm:mb-2 sm:text-xs">
                {article.category.name}
              </span>
              <h2 className="text-lg font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:mt-2 sm:text-sm md:text-base">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-white/70 sm:mt-3 sm:gap-3 sm:text-xs">
                <span>{article.author.name}</span>
                <span aria-hidden="true">•</span>
                <time dateTime={article.publishedAt?.toISOString()}>
                  {formatRelativeDate(article.publishedAt, locale)}
                </time>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={cn("group flex gap-3 sm:gap-4", className)}>
        <Link
          href={newsHref}
          className="relative block h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-40"
        >
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 96px, 160px"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-100" />
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <Link
            href={categoryHref}
            className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 hover:underline sm:text-xs"
          >
            {article.category.name}
          </Link>
          <Link href={newsHref} className="mt-0.5 block sm:mt-1">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-brand-600 transition-colors sm:text-base">
              {article.title}
            </h3>
          </Link>
          <time
            dateTime={article.publishedAt?.toISOString()}
            className="mt-1 text-[10px] text-news-muted sm:text-xs"
          >
            {formatRelativeDate(article.publishedAt, locale)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <Link href={newsHref}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand-600 transition-colors">
            {article.title}
          </h3>
          <time
            dateTime={article.publishedAt?.toISOString()}
            className="mt-1 block text-xs text-news-muted"
          >
            {formatRelativeDate(article.publishedAt, locale)}
          </time>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link href={newsHref} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-200" />
          )}
          {article.isBreaking && (
            <span className="absolute start-2 top-2 rounded bg-news-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white sm:text-xs">
              {dict.article.breaking}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <Link
          href={categoryHref}
          className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 hover:underline sm:text-xs"
        >
          {article.category.name}
        </Link>
        <Link href={newsHref} className="mt-1 block">
          <h3 className="line-clamp-2 text-base font-bold leading-snug group-hover:text-brand-600 transition-colors sm:text-lg">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-news-muted">
            {article.excerpt}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-news-muted">
          <span>{article.author.name}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={article.publishedAt?.toISOString()}>
            {formatRelativeDate(article.publishedAt, locale)}
          </time>
        </div>
      </div>
    </article>
  );
}

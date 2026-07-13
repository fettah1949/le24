import Link from "next/link";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface CategoryNavProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    _count?: { articles: number };
  }[];
  locale: Locale;
  dict: Dictionary;
}

export function CategoryNav({ categories, locale, dict }: CategoryNavProps) {
  return (
    <nav aria-label={dict.home.categories} className="border-b border-news-border bg-white">
      <div className="container-main scroll-fade-x">
        <ul className="flex gap-1 overflow-x-auto py-2.5 scrollbar-hide sm:py-3 snap-x snap-mandatory">
          <li>
            <Link
              href={localizedPath(locale)}
              className="snap-start whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-news-text hover:bg-brand-50 hover:text-brand-600 transition-colors sm:px-4 sm:py-1.5"
            >
              {dict.nav.all}
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={localizedPath(locale, `/category/${cat.slug}`)}
                className="snap-start whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-news-muted hover:bg-brand-50 hover:text-brand-600 transition-colors sm:px-4 sm:py-1.5"
              >
                {cat.name}
                {cat._count && (
                  <span className="ms-1 text-xs opacity-60">
                    ({cat._count.articles})
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

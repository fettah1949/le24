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
      <div className="container-main">
        <ul className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          <li>
            <Link
              href={localizedPath(locale)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-news-text hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              {dict.nav.all}
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={localizedPath(locale, `/category/${cat.slug}`)}
                className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-news-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
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

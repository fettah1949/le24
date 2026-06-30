import Link from "next/link";
import { cn } from "@/lib/utils";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import type { BreadcrumbItem } from "@/types";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: Locale;
  dict: Dictionary;
  className?: string;
}

export function Breadcrumbs({ items, locale, dict, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={dict.breadcrumb.aria} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-news-muted">
        <li>
          <Link
            href={localizedPath(locale)}
            className="hover:text-brand-600 transition-colors"
          >
            {dict.breadcrumb.home}
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link
                href={item.href.startsWith("/") ? localizedPath(locale, item.href) : item.href}
                className="hover:text-brand-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-news-text font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

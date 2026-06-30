import Link from "next/link";
import { localizedPath } from "@/lib/i18n/paths";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-news-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-main flex h-16 items-center justify-between gap-4">
        <Link href={localizedPath(locale)} className="flex-shrink-0">
          <span className="text-2xl font-bold text-brand-700">
            <span className="font-semibold text-brand-600">Le</span>24
          </span>
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav
          aria-label={dict.nav.mainNav}
          className="flex items-center gap-3 sm:gap-4"
        >
          <LanguageSwitcher locale={locale} label={dict.language.switch} />

          <Link
            href={localizedPath(locale, "/about")}
            className="hidden sm:block text-sm font-medium text-news-muted hover:text-brand-600 transition-colors"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={localizedPath(locale, "/contact")}
            className="hidden sm:block text-sm font-medium text-news-muted hover:text-brand-600 transition-colors"
          >
            {dict.nav.contact}
          </Link>
          <Link
            href={localizedPath(locale, "/search")}
            className="md:hidden text-news-muted hover:text-brand-600"
            aria-label={dict.nav.search}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}

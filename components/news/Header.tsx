import Link from "next/link";
import { localizedPath } from "@/lib/i18n/paths";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-news-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-main flex h-14 items-center justify-between gap-3 sm:h-16 sm:gap-4">
        <Link href={localizedPath(locale)} className="flex-shrink-0">
          <span className="text-xl font-bold text-brand-700 sm:text-2xl">
            <span className="font-semibold text-brand-600">Le</span>24
          </span>
        </Link>

        <div className="hidden lg:block flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav
          aria-label={dict.nav.mainNav}
          className="hidden lg:flex items-center gap-4"
        >
          <LanguageSwitcher locale={locale} label={dict.language.switch} />
          <Link
            href={localizedPath(locale, "/about")}
            className="text-sm font-medium text-news-muted hover:text-brand-600 transition-colors"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={localizedPath(locale, "/contact")}
            className="text-sm font-medium text-news-muted hover:text-brand-600 transition-colors"
          >
            {dict.nav.contact}
          </Link>
        </nav>

        <MobileMenu locale={locale} dict={dict} />
      </div>
    </header>
  );
}

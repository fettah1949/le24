"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  className?: string;
}

export function LanguageSwitcher({
  locale,
  label,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="sr-only">{label}</span>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={switchLocalePath(pathname, loc)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            locale === loc
              ? "bg-brand-600 text-white"
              : "text-news-muted hover:bg-brand-50 hover:text-brand-600"
          )}
          hrefLang={loc}
          lang={loc}
        >
          {loc === "fr" ? "FR" : "عربي"}
        </Link>
      ))}
    </div>
  );
}

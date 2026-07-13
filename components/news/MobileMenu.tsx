"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface MobileMenuProps {
  locale: Locale;
  dict: Dictionary;
}

export function MobileMenu({ locale, dict }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: localizedPath(locale), label: dict.nav.home },
    { href: localizedPath(locale, "/about"), label: dict.nav.about },
    { href: localizedPath(locale, "/contact"), label: dict.nav.contact },
    { href: localizedPath(locale, "/search"), label: dict.nav.search },
    { href: localizedPath(locale, "/privacy"), label: dict.nav.privacy },
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-news-muted hover:bg-gray-100 hover:text-brand-600"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-news-border bg-white shadow-lg"
          >
            <div className="container-main space-y-4 py-4">
              <SearchBar />
              <ul className="divide-y divide-news-border">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center py-3 text-base font-medium text-news-text hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <LanguageSwitcher locale={locale} label={dict.language.switch} />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

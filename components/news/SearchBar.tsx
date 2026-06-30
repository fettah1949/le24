"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { localizedPath } from "@/lib/i18n/paths";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const { locale, dict } = useI18n();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(
        `${localizedPath(locale, "/search")}?q=${encodeURIComponent(query.trim())}`
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.search.placeholder}
          className="input-field ps-10"
          aria-label={dict.nav.search}
        />
        <svg
          className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-news-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </form>
  );
}

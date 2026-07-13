import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  dict: Dictionary;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  dict,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav aria-label={dict.pagination.aria} className={cn("flex flex-wrap justify-center gap-1.5 sm:gap-2", className)}>
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="btn-secondary px-3 py-1.5 text-xs sm:text-sm">
          <span className="sm:hidden">←</span>
          <span className="hidden sm:inline">{dict.pagination.prev}</span>
        </Link>
      )}

      {pages.map((page, index) => {
        const prev = pages[index - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-news-muted">…</span>}
            <Link
              href={`${basePath}?page=${page}`}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-brand-600 text-white"
                  : "text-news-muted hover:bg-gray-100"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="btn-secondary px-3 py-1.5 text-xs sm:text-sm">
          <span className="hidden sm:inline">{dict.pagination.next}</span>
          <span className="sm:hidden">→</span>
        </Link>
      )}
    </nav>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME ?? "Le24";
}

import type { Locale } from "@/lib/i18n/config";
import { getIntlLocale } from "@/lib/i18n/config";

export function formatDate(
  date: Date | string | null | undefined,
  locale: Locale = "fr"
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatRelativeDate(
  date: Date | string | null | undefined,
  locale: Locale = "fr"
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === "ar") {
    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} د`;
    if (diffHours < 24) return `منذ ${diffHours} س`;
    if (diffDays < 7) return `منذ ${diffDays} ي`;
    return formatDate(d, locale);
  }

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(d, locale);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

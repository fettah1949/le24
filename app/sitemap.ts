import type { MetadataRoute } from "next";
import {
  getAllPublishedSlugs,
  getAllCategorySlugs,
  getAllAuthorSlugs,
  getAllTagSlugs,
} from "@/lib/queries/articles";
import { getSiteUrl } from "@/lib/utils";
import { locales } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPaths = ["", "/about", "/contact", "/privacy"];

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}${localizedPath(locale, path === "" ? "" : path)}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("hourly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.5,
    }))
  );

  try {
    const [articles, categories, authors, tags] = await Promise.all([
      getAllPublishedSlugs(),
      getAllCategorySlugs(),
      getAllAuthorSlugs(),
      getAllTagSlugs(),
    ]);

    const dynamicPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
      ...articles.map((a) => ({
        url: `${baseUrl}${localizedPath(locale, `/news/${a.slug}`)}`,
        lastModified: a.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...categories.map((c) => ({
        url: `${baseUrl}${localizedPath(locale, `/category/${c.slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
      ...authors.map((a) => ({
        url: `${baseUrl}${localizedPath(locale, `/author/${a.slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...tags.map((t) => ({
        url: `${baseUrl}${localizedPath(locale, `/tag/${t.slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
    ]);

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}

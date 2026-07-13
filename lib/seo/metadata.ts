import type { Metadata } from "next";
import { absoluteUrl, getSiteName, getSiteUrl } from "@/lib/utils";
import { resolveImageSrc } from "@/lib/image-url";
import { locales, type Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";

const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  ar: "ar_MA",
};

export interface SeoConfig {
  locale: Locale;
  /** Path without locale prefix, e.g. `/news/slug`, `/about`, or `` for home */
  pathWithoutLocale: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  /** Extra query string for hreflang/canonical, e.g. `?q=foo` */
  queryString?: string;
}

function buildHreflangLanguages(
  pathWithoutLocale: string,
  queryString = ""
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = absoluteUrl(
      `${localizedPath(loc, pathWithoutLocale)}${queryString}`
    );
  }
  languages["x-default"] = absoluteUrl(
    `${localizedPath("fr", pathWithoutLocale)}${queryString}`
  );
  return languages;
}

export function buildMetadata(config: SeoConfig): Metadata {
  const siteName = getSiteName();
  const canonicalPath = `${localizedPath(config.locale, config.pathWithoutLocale)}${config.queryString ?? ""}`;
  const url = absoluteUrl(canonicalPath);
  const imagePath = config.image
    ? resolveImageSrc(config.image) ?? config.image
    : null;
  const image = imagePath
    ? absoluteUrl(imagePath)
    : absoluteUrl("/og-default.jpg");

  const alternateLocale = locales.filter((l) => l !== config.locale);

  return {
    title: config.title,
    description: config.description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: url,
      languages: buildHreflangLanguages(
        config.pathWithoutLocale,
        config.queryString
      ),
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName,
      locale: OG_LOCALE[config.locale],
      alternateLocale: alternateLocale.map((l) => OG_LOCALE[l]),
      type: config.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: config.title }],
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      ...(config.authors && { authors: config.authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [image],
    },
    robots: config.noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export function buildNewsArticleJsonLd(
  article: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
    author: { name: string; slug: string };
    category: { name: string; slug: string };
  },
  locale: Locale
) {
  const articlePath = localizedPath(locale, `/news/${article.slug}`);
  const authorPath = localizedPath(locale, `/author/${article.author.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? article.title,
    image: article.featuredImage
      ? [absoluteUrl(resolveImageSrc(article.featuredImage) ?? article.featuredImage)]
      : [],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: locale === "ar" ? "ar-MA" : "fr-FR",
    author: {
      "@type": "Person",
      name: article.author.name,
      url: absoluteUrl(authorPath),
    },
    publisher: buildOrganizationJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(articlePath),
    },
    articleSection: article.category.name,
    url: absoluteUrl(articlePath),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@type": "Organization",
    name: getSiteName(),
    url: getSiteUrl(),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
  };
}

export function buildPersonJsonLd(
  author: {
    name: string;
    slug: string;
    bio: string | null;
    avatar: string | null;
    twitter: string | null;
    website: string | null;
  },
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: absoluteUrl(localizedPath(locale, `/author/${author.slug}`)),
    description: author.bio,
    image: author.avatar
      ? absoluteUrl(resolveImageSrc(author.avatar) ?? author.avatar)
      : undefined,
    sameAs: [author.twitter, author.website].filter(Boolean),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: getSiteName(),
    url: getSiteUrl(),
    inLanguage: ["fr-FR", "ar-MA"],
    potentialAction: {
      "@type": "SearchAction",
      target: [
        {
          "@type": "EntryPoint",
          urlTemplate: absoluteUrl(
            `${localizedPath("fr", "/search")}?q={search_term_string}`
          ),
          inLanguage: "fr-FR",
        },
        {
          "@type": "EntryPoint",
          urlTemplate: absoluteUrl(
            `${localizedPath("ar", "/search")}?q={search_term_string}`
          ),
          inLanguage: "ar-MA",
        },
      ],
      "query-input": "required name=search_term_string",
    },
  };
}

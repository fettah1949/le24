import prisma from "@/lib/db/prisma";
import { ArticleStatus, Prisma } from "@prisma/client";

const publishedFilter: Prisma.ArticleWhereInput = {
  status: ArticleStatus.PUBLISHED,
  publishedAt: { lte: new Date() },
};

const articleInclude = {
  category: true,
  author: true,
  tags: { include: { tag: true } },
} satisfies Prisma.ArticleInclude;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export async function getTopStories(limit = 5) {
  return prisma.article.findMany({
    where: publishedFilter,
    include: articleInclude,
    orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getLatestNews(limit = 12) {
  return prisma.article.findMany({
    where: publishedFilter,
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBreakingNews(limit = 5) {
  return prisma.article.findMany({
    where: { ...publishedFilter, isBreaking: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getTrendingArticles(limit = 6) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return prisma.article.findMany({
    where: {
      ...publishedFilter,
      publishedAt: { gte: weekAgo },
    },
    include: articleInclude,
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { articles: { where: publishedFilter } } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { articles: { where: publishedFilter } } },
    },
  });
}

export async function getArticlesByCategory(
  categoryId: string,
  page = 1,
  limit = 12
) {
  const skip = (page - 1) * limit;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { ...publishedFilter, categoryId },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({
      where: { ...publishedFilter, categoryId },
    }),
  ]);
  return { articles, total, pages: Math.ceil(total / limit) };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: articleInclude,
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedFilter },
    include: articleInclude,
  });
}

export async function incrementArticleViews(id: string) {
  return prisma.article.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit = 4
) {
  return prisma.article.findMany({
    where: {
      ...publishedFilter,
      categoryId,
      id: { not: articleId },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAuthorBySlug(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      _count: { select: { articles: { where: publishedFilter } } },
    },
  });
}

export async function getArticlesByAuthor(
  authorId: string,
  page = 1,
  limit = 12
) {
  const skip = (page - 1) * limit;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { ...publishedFilter, authorId },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({
      where: { ...publishedFilter, authorId },
    }),
  ]);
  return { articles, total, pages: Math.ceil(total / limit) };
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          articles: {
            where: { article: publishedFilter },
          },
        },
      },
    },
  });
}

export async function getArticlesByTag(
  tagId: string,
  page = 1,
  limit = 12
) {
  const skip = (page - 1) * limit;
  const where = {
    article: publishedFilter,
    tagId,
  };

  const [articleTags, total] = await Promise.all([
    prisma.articleTag.findMany({
      where,
      include: { article: { include: articleInclude } },
      orderBy: { article: { publishedAt: "desc" } },
      skip,
      take: limit,
    }),
    prisma.articleTag.count({ where }),
  ]);

  return {
    articles: articleTags.map((at) => at.article),
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function searchArticles(query: string, page = 1, limit = 12) {
  const sanitizedQuery = query.trim().slice(0, 200);
  if (sanitizedQuery.length < 2) {
    return { articles: [], total: 0, pages: 0 };
  }

  const skip = (page - 1) * limit;
  const where: Prisma.ArticleWhereInput = {
    ...publishedFilter,
    OR: [
      { title: { contains: sanitizedQuery, mode: "insensitive" } },
      { excerpt: { contains: sanitizedQuery, mode: "insensitive" } },
      { content: { contains: sanitizedQuery, mode: "insensitive" } },
    ],
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total, pages: Math.ceil(total / limit) };
}

export async function getAllPublishedSlugs() {
  return prisma.article.findMany({
    where: publishedFilter,
    select: { slug: true, updatedAt: true },
  });
}

export async function getAllCategorySlugs() {
  return prisma.category.findMany({ select: { slug: true } });
}

export async function getAllAuthorSlugs() {
  return prisma.author.findMany({ select: { slug: true } });
}

export async function getAllTagSlugs() {
  return prisma.tag.findMany({ select: { slug: true } });
}

// Admin queries
export async function getAdminStats() {
  const [totalArticles, published, drafts, scheduled, categories, authors, tags] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
      prisma.article.count({ where: { status: ArticleStatus.DRAFT } }),
      prisma.article.count({ where: { status: ArticleStatus.SCHEDULED } }),
      prisma.category.count(),
      prisma.author.count(),
      prisma.tag.count(),
    ]);

  return { totalArticles, published, drafts, scheduled, categories, authors, tags };
}

export async function getAdminArticles(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      include: articleInclude,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count(),
  ]);
  return { articles, total, pages: Math.ceil(total / limit) };
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function getAdminTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function getAdminAuthors() {
  return prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function getAdminArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: articleInclude,
  });
}

export async function getAdminCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function getAdminTagById(id: string) {
  return prisma.tag.findUnique({ where: { id } });
}

export async function getAdminAuthorById(id: string) {
  return prisma.author.findUnique({ where: { id } });
}

export async function getAllAuthorsForSelect() {
  return prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllCategoriesForSelect() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllTagsForSelect() {
  return prisma.tag.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

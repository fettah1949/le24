import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { articleSchema, parsePageParam } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { sanitizeHtml, normalizeImageUrl } from "@/lib/sanitize";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";
import { ArticleStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const page = parsePageParam(request.nextUrl.searchParams.get("page"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count(),
  ]);

  return NextResponse.json({
    articles,
    total,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = articleSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.title);

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt ?? null,
        content: sanitizeHtml(data.content),
        featuredImage: normalizeImageUrl(data.featuredImage),
        status: data.status as ArticleStatus,
        publishedAt:
          data.status === "PUBLISHED" || data.status === "SCHEDULED"
            ? data.publishedAt
              ? new Date(data.publishedAt)
              : new Date()
            : null,
        categoryId: data.categoryId,
        authorId: data.authorId,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        ogImage: normalizeImageUrl(data.ogImage),
        isBreaking: data.isBreaking,
        tags: {
          create: data.tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return serverError();
  }
}

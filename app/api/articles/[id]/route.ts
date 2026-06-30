import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { articleSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { sanitizeHtml, normalizeImageUrl } from "@/lib/sanitize";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";
import { ArticleStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = articleSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.title);

    const existing = await prisma.article.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }

    await prisma.articleTag.deleteMany({ where: { articleId: id } });

    const article = await prisma.article.update({
      where: { id },
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

    return NextResponse.json(article);
  } catch {
    return serverError();
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return serverError();
  }
}

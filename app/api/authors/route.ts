import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { authorSchema } from "@/lib/validations";
import { normalizeImageUrl } from "@/lib/sanitize";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return NextResponse.json(authors);
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = authorSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const author = await prisma.author.create({
      data: {
        ...parsed.data,
        email: parsed.data.email || null,
        website: parsed.data.website || null,
        avatar: normalizeImageUrl(parsed.data.avatar),
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch {
    return serverError();
  }
}

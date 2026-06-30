import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { tagSchema } from "@/lib/validations";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = tagSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const tag = await prisma.tag.create({ data: parsed.data });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return serverError();
  }
}

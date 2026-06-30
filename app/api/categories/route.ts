import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return serverError();
  }
}

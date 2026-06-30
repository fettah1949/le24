import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(category);
  } catch {
    return serverError();
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Impossible de supprimer (articles associés ?)" },
      { status: 400 }
    );
  }
}

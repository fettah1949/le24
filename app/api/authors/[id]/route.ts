import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { authorSchema } from "@/lib/validations";
import { normalizeImageUrl } from "@/lib/sanitize";
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
    const parsed = authorSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        ...parsed.data,
        email: parsed.data.email || null,
        website: parsed.data.website || null,
        avatar: normalizeImageUrl(parsed.data.avatar),
      },
    });

    return NextResponse.json(author);
  } catch {
    return serverError();
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    await prisma.author.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Impossible de supprimer (articles associés ?)" },
      { status: 400 }
    );
  }
}

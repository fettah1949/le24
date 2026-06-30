import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { adSchema } from "@/lib/validations";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";
import { sanitizeHtml } from "@/lib/sanitize";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseAdData(data: ReturnType<typeof adSchema.parse>) {
  return {
    name: data.name,
    slot: data.slot,
    type: data.type,
    imageUrl: data.imageUrl || null,
    linkUrl: data.linkUrl || null,
    htmlCode: data.htmlCode ? sanitizeHtml(data.htmlCode) : null,
    isActive: data.isActive,
    priority: data.priority,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const ad = await prisma.ad.findUnique({ where: { id } });
  if (!ad) {
    return NextResponse.json({ error: "Publicité non trouvée" }, { status: 404 });
  }

  return NextResponse.json(ad);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = adSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    if (parsed.data.type === "IMAGE" && !parsed.data.imageUrl) {
      return validationError("Image requise pour une publicité IMAGE");
    }
    if (parsed.data.type === "HTML" && !parsed.data.htmlCode) {
      return validationError("Code HTML requis pour une publicité HTML");
    }

    const ad = await prisma.ad.update({
      where: { id },
      data: parseAdData(parsed.data),
    });

    return NextResponse.json(ad);
  } catch {
    return serverError();
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    await prisma.ad.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return serverError();
  }
}

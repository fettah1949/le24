import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { adSchema } from "@/lib/validations";
import { ensureAdmin, serverError, validationError } from "@/lib/api-helpers";
import { sanitizeHtml } from "@/lib/sanitize";

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

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const ads = await prisma.ad.findMany({
    orderBy: [{ slot: "asc" }, { priority: "desc" }],
  });

  return NextResponse.json(ads);
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
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

    const ad = await prisma.ad.create({ data: parseAdData(parsed.data) });
    return NextResponse.json(ad, { status: 201 });
  } catch {
    return serverError();
  }
}

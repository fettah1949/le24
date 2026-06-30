import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { newsletterSchema } from "@/lib/validations";
import { serverError, validationError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    await prisma.newsletter.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: {},
      create: { email: parsed.data.email.toLowerCase() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return serverError();
  }
}

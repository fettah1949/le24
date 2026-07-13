import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { serverError, validationError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.errors[0].message);
    }

    const user = await authenticateUser(parsed.data.email, parsed.data.password);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    await createSession(user);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);

    if (err instanceof Error) {
      if (err.message.includes("NEXTAUTH_SECRET")) {
        return NextResponse.json(
          { error: "Configuration: NEXTAUTH_SECRET manquant ou invalide sur Vercel" },
          { status: 500 }
        );
      }
      if (
        err.message.includes("DATABASE_URL") ||
        err.message.includes("Can't reach database") ||
        err.message.includes("connect")
      ) {
        return NextResponse.json(
          { error: "Configuration: DATABASE_URL manquant ou incorrect sur Vercel" },
          { status: 500 }
        );
      }
    }

    return serverError();
  }
}

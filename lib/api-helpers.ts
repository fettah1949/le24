import { NextResponse } from "next/server";
import {
  requireAdmin,
  forbiddenResponse,
  unauthorizedResponse,
  type SessionUser,
} from "@/lib/auth";

type AdminResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

export async function ensureAdmin(): Promise<AdminResult> {
  try {
    const user = await requireAdmin();
    return { ok: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Forbidden") {
      return { ok: false, response: forbiddenResponse() };
    }
    return { ok: false, response: unauthorizedResponse() };
  }
}

export function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError() {
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}

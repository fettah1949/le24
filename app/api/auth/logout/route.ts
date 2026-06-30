import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await destroySession();
  return NextResponse.json({ success: true });
}

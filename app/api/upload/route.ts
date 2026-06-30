import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { detectImageType } from "@/lib/file-validation";
import { ensureAdmin, serverError } from "@/lib/api-helpers";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5 Mo)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detected = detectImageType(buffer);
    if (!detected || !ALLOWED_MIME.has(detected.mime)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      );
    }

    const ext = detected.ext;
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return serverError();
  }
}

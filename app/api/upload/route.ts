import { NextRequest, NextResponse } from "next/server";
import { detectImageType } from "@/lib/file-validation";
import { ensureAdmin } from "@/lib/api-helpers";
import { storeImage, formatUploadError } from "@/lib/image-storage";

export const runtime = "nodejs";

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
        {
          error:
            "Format non supporté. Utilisez JPG, PNG, WebP ou GIF (pas HEIC).",
        },
        { status: 400 }
      );
    }

    const url = await storeImage(buffer, detected.ext);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: formatUploadError(err) },
      { status: 500 }
    );
  }
}

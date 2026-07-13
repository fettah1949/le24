import { createHash } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function getMime(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return map[ext] ?? "application/octet-stream";
}

function hasCloudinaryConfig(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function getBlobAccess(): "public" | "private" {
  if (process.env.BLOB_ACCESS === "public") return "public";
  return "private";
}

export async function getBlobClientOptions(
  access: "public" | "private" = getBlobAccess()
) {
  const auth = await getVercelBlobAuth();
  return { access, ...auth };
}

async function getVercelBlobAuth(): Promise<{
  token?: string;
  oidcToken?: string;
  storeId?: string;
}> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }

  const storeId = process.env.BLOB_STORE_ID;
  if (!storeId) {
    throw new Error(
      "Blob non configuré. Connectez le24-blob au projet sur Vercel."
    );
  }

  const oidcToken = process.env.VERCEL_OIDC_TOKEN;
  if (oidcToken) {
    return { oidcToken, storeId };
  }

  try {
    const { getVercelOidcToken } = await import("@vercel/oidc");
    const fetched = await getVercelOidcToken();
    if (fetched) {
      return { oidcToken: fetched, storeId };
    }
  } catch {
    // fall through
  }

  throw new Error(
    "Authentification Blob échouée. Dans Vercel → Storage → le24-blob, copiez le Read/Write Token et ajoutez BLOB_READ_WRITE_TOKEN aux variables d'environnement, puis redéployez."
  );
}

async function uploadToCloudinary(buffer: Buffer, ext: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.round(Date.now() / 1000).toString();
  const signature = createHash("sha1")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(buffer)], { type: getMime(ext) }),
    `upload.${ext}`
  );
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Échec upload Cloudinary");
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Réponse Cloudinary invalide");
  }

  return data.secure_url;
}

async function uploadToVercelBlob(buffer: Buffer, ext: string): Promise<string> {
  const { put } = await import("@vercel/blob");
  const filename = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const access = getBlobAccess();
  const options = await getBlobClientOptions(access);

  const blob = await put(filename, buffer, {
    ...options,
    contentType: getMime(ext),
    addRandomSuffix: false,
  });

  return blob.url;
}

async function uploadToLocal(buffer: Buffer, ext: string): Promise<string> {
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

function hasVercelBlobConfig(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function storeImage(buffer: Buffer, ext: string): Promise<string> {
  if (hasCloudinaryConfig()) {
    return uploadToCloudinary(buffer, ext);
  }

  if (hasVercelBlobConfig()) {
    return uploadToVercelBlob(buffer, ext);
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Stockage cloud requis en production. Configurez Vercel Blob ou Cloudinary."
    );
  }

  return uploadToLocal(buffer, ext);
}

export function formatUploadError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("Access denied")) {
      return "Accès Blob refusé. Ajoutez BLOB_READ_WRITE_TOKEN depuis Vercel → Storage → le24-blob.";
    }
    if (err.message.includes("No blob credentials")) {
      return "Credentials Blob manquants. Ajoutez BLOB_READ_WRITE_TOKEN sur Vercel.";
    }
    return err.message;
  }
  return "Erreur serveur";
}

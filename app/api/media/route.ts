import { NextRequest, NextResponse } from "next/server";
import { getBlobClientOptions } from "@/lib/image-storage";
import { isPrivateBlobUrl } from "@/lib/image-url";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isPrivateBlobUrl(url)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const { get } = await import("@vercel/blob");
    const options = await getBlobClientOptions("private");
    const result = await get(url, options);

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream as ReadableStream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Media proxy error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}

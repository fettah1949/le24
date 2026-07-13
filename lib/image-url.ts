const PRIVATE_BLOB_HOST = /\.private\.blob\.vercel-storage\.com/i;

export function isPrivateBlobUrl(url: string): boolean {
  return PRIVATE_BLOB_HOST.test(url);
}

/** Serve private Vercel Blob images through our API proxy. */
export function resolveImageSrc(url: string | null | undefined): string | undefined {
  if (!url || url.trim() === "") return undefined;
  if (isPrivateBlobUrl(url)) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}

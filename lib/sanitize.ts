import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "span",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "class"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });
}

export function sanitizeJsonLd(data: unknown): string {
  const json = JSON.stringify(data);
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

export function isSafeImageUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url, "http://localhost");
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    if (parsed.protocol === "http:" && parsed.hostname !== "localhost") return false;
    return true;
  } catch {
    return url.startsWith("/") && !url.includes("..");
  }
}

export function normalizeImageUrl(url: string | undefined | null): string | null {
  if (!url || url.trim() === "") return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) {
    if (trimmed.includes("..")) return null;
    return trimmed;
  }
  return isSafeImageUrl(trimmed) ? trimmed : null;
}

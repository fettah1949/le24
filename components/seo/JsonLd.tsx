import { sanitizeJsonLd } from "@/lib/sanitize";

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(data) }}
    />
  );
}

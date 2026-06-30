import Image from "next/image";
import Link from "next/link";
import type { Ad } from "@prisma/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { AD_SLOTS, type AdSlotId } from "@/lib/ads/slots";

interface CustomAdProps {
  ad: Ad;
  slot: AdSlotId;
  label: string;
}

export function CustomAd({ ad, slot, label }: CustomAdProps) {
  const config = AD_SLOTS[slot];

  if (ad.type === "HTML" && ad.htmlCode) {
    return (
      <AdWrapper label={label} minHeight={config.minHeight}>
        <div
          className="w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(ad.htmlCode) }}
        />
      </AdWrapper>
    );
  }

  if (ad.type === "IMAGE" && ad.imageUrl) {
    const content = (
      <div
        className="relative w-full overflow-hidden rounded-lg bg-gray-100"
        style={{ minHeight: config.minHeight }}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.name}
          fill
          className="object-contain"
          sizes={config.format === "vertical" ? "300px" : "100vw"}
        />
      </div>
    );

    return (
      <AdWrapper label={label} minHeight={config.minHeight}>
        {ad.linkUrl ? (
          <Link
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </AdWrapper>
    );
  }

  return null;
}

function AdWrapper({
  label,
  minHeight,
  children,
}: {
  label: string;
  minHeight: number;
  children: React.ReactNode;
}) {
  return (
    <aside
      className="ad-slot my-4 w-full"
      aria-label={label}
      style={{ minHeight }}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-news-muted">
        {label}
      </p>
      {children}
    </aside>
  );
}

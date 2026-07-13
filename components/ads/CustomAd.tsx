import Image from "next/image";
import Link from "next/link";
import type { Ad } from "@prisma/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { AD_SLOTS, type AdSlotId } from "@/lib/ads/slots";
import { cn } from "@/lib/utils";
interface CustomAdProps {
  ad: Ad;
  slot: AdSlotId;
  label: string;
}

export function CustomAd({ ad, slot, label }: CustomAdProps) {
  const config = AD_SLOTS[slot];

  if (ad.type === "HTML" && ad.htmlCode) {
    return (
      <AdWrapper label={label} heightClass={config.heightClass}>
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
        className={cn("relative w-full overflow-hidden rounded-lg bg-gray-100", config.heightClass)}
      >        <Image
          src={ad.imageUrl}
          alt={ad.name}
          fill
          className="object-contain"
          sizes={config.format === "vertical" ? "300px" : "100vw"}
        />
      </div>
    );

    return (
      <AdWrapper label={label} heightClass={config.heightClass}>
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
  heightClass,
  children,
}: {
  label: string;
  heightClass: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={cn("ad-slot my-4 w-full", heightClass)} aria-label={label}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-news-muted">
        {label}
      </p>
      {children}
    </aside>
  );
}

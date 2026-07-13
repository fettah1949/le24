import { getActiveAdBySlot } from "@/lib/queries/ads";
import {
  AD_SLOTS,
  getAdSenseClientId,
  getAdSenseSlotId,
  isAdsEnabled,
  type AdSlotId,
} from "@/lib/ads/slots";
import { CustomAd } from "./CustomAd";
import { AdSenseUnit } from "./AdSenseUnit";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot: AdSlotId;
  label: string;
  className?: string;
}

export async function AdSlot({ slot, label, className }: AdSlotProps) {
  if (!isAdsEnabled()) return null;

  const customAd = await getActiveAdBySlot(slot);
  if (customAd) {
    return (
      <div className={cn("w-full", className)}>
        <CustomAd ad={customAd} slot={slot} label={label} />
      </div>
    );
  }

  const clientId = getAdSenseClientId();
  const adsenseSlot = getAdSenseSlotId(slot);

  if (clientId && adsenseSlot) {
    const config = AD_SLOTS[slot];
    return (
      <aside
        className={cn("ad-slot my-4 w-full", config.heightClass, className)}
        aria-label={label}
      >
        <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-news-muted">
          {label}
        </p>
        <AdSenseUnit
          slotId={adsenseSlot}
          format={config.format === "vertical" ? "vertical" : "horizontal"}
        />
      </aside>
    );
  }

  if (process.env.NODE_ENV === "development") {
    const config = AD_SLOTS[slot];
    return (
      <aside
        className={cn(
          "ad-slot my-4 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50",
          config.heightClass,
          className
        )}
        aria-label={label}
      >
        <p className="text-[10px] uppercase tracking-wider text-news-muted">
          {label}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-400">{config.label}</p>
        <p className="mt-1 text-xs text-gray-400">
          Ajoutez une pub dans Admin → Publicités
        </p>
      </aside>
    );
  }

  return null;
}

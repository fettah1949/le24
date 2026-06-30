export const AD_SLOTS = {
  "header-banner": {
    label: "Bannière header (728×90)",
    format: "horizontal" as const,
    minHeight: 90,
  },
  "home-mid": {
    label: "Accueil — milieu de page",
    format: "horizontal" as const,
    minHeight: 250,
  },
  "article-top": {
    label: "Article — haut",
    format: "horizontal" as const,
    minHeight: 250,
  },
  "article-bottom": {
    label: "Article — bas",
    format: "horizontal" as const,
    minHeight: 250,
  },
  sidebar: {
    label: "Sidebar (300×600)",
    format: "vertical" as const,
    minHeight: 600,
  },
  "category-top": {
    label: "Catégorie — haut",
    format: "horizontal" as const,
    minHeight: 250,
  },
} as const;

export type AdSlotId = keyof typeof AD_SLOTS;

export const AD_SLOT_IDS = Object.keys(AD_SLOTS) as AdSlotId[];

export function getAdSenseClientId(): string | null {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? null;
}

export function getAdSenseSlotId(slot: AdSlotId): string | null {
  const envKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, "_")}`;
  return process.env[envKey] ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT ?? null;
}

export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";
}

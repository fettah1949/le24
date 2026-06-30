"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSenseUnit({
  slotId,
  format = "auto",
  className,
}: AdSenseUnitProps) {
  const pushed = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

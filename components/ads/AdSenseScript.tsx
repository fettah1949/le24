import Script from "next/script";
import { getAdSenseClientId } from "@/lib/ads/slots";

export function AdSenseScript() {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

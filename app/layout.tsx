import type { Metadata } from "next";

import { headers } from "next/headers";

import { Inter, Merriweather, Cairo } from "next/font/google";

import { JsonLd } from "@/components/seo/JsonLd";

import { buildWebsiteJsonLd } from "@/lib/seo/metadata";

import { getSiteName } from "@/lib/utils";

import { defaultLocale, getDirection, isValidLocale } from "@/lib/i18n/config";

import { AdSenseScript } from "@/components/ads/AdSenseScript";
import "./globals.css";



const inter = Inter({

  subsets: ["latin"],

  variable: "--font-inter",

  display: "swap",

});



const merriweather = Merriweather({

  subsets: ["latin"],

  weight: ["400", "700"],

  variable: "--font-merriweather",

  display: "swap",

});



const cairo = Cairo({

  subsets: ["arabic", "latin"],

  variable: "--font-cairo",

  display: "swap",

});



export const metadata: Metadata = {

  title: getSiteName(),

  description: "Actualités 24h/24",

};



export default async function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  const headersList = await headers();

  const localeHeader = headersList.get("x-locale");

  const locale =

    localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale;

  const dir = getDirection(locale);



  return (

    <html

      lang={locale}

      dir={dir}

      suppressHydrationWarning

      className={`${inter.variable} ${merriweather.variable} ${cairo.variable}`}

    >

      <head>
        <JsonLd data={buildWebsiteJsonLd()} />
        <AdSenseScript />
      </head>

      <body className="min-h-screen font-sans">{children}</body>

    </html>

  );

}



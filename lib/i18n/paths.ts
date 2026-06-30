import type { Locale } from "./config";

export function localizedPath(locale: Locale, path: string = ""): string {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${clean}`;
}

export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/");
  if (segments[1] === "fr" || segments[1] === "ar") {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

export function switchLocalePath(
  currentPath: string,
  newLocale: Locale
): string {
  const stripped = stripLocaleFromPath(currentPath);
  return localizedPath(newLocale, stripped === "/" ? "" : stripped);
}

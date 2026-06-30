import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME, WEAK_SECRETS } from "@/lib/auth-constants";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";

function getSecret(): Uint8Array | null {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32 || WEAK_SECRETS.has(secret)) return null;
  return new TextEncoder().encode(secret);
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: http://localhost",
      "font-src 'self' data:",
      "connect-src 'self' https://pagead2.googlesyndication.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  return response;
}

async function verifyAdminCookie(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const secret = getSecret();
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Locale routing for public pages
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");
  const isNext = pathname.startsWith("/_next");
  const isStaticFile = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (!isAdmin && !isApi && !isNext && !isStaticFile) {
    const firstSegment = pathname.split("/")[1];

    if (pathname === "/") {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
      );
    }

    if (!isValidLocale(firstSegment)) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
      );
    }
  }

  // Rate limiting on sensitive public endpoints
  if (pathname === "/api/auth/login") {
    const { success } = rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
    if (!success) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Trop de tentatives. Réessayez dans 15 minutes." },
          { status: 429 }
        )
      );
    }
  }

  if (pathname === "/api/newsletter") {
    const { success } = rateLimit(`newsletter:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!success) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })
      );
    }
  }

  if (pathname === "/api/upload") {
    const { success } = rateLimit(`upload:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!success) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Trop d'uploads." }, { status: 429 })
      );
    }
  }

  // Protect admin dashboard routes (not login)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const isAdmin = await verifyAdminCookie(request);
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // Protect admin API routes
  const publicApiRoutes = ["/api/auth/login", "/api/newsletter"];
  if (
    pathname.startsWith("/api/") &&
    !publicApiRoutes.some((r) => pathname.startsWith(r))
  ) {
    const isAdmin = await verifyAdminCookie(request);
    if (!isAdmin) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Non autorisé" }, { status: 401 })
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  const firstSegment = pathname.split("/")[1];
  if (isValidLocale(firstSegment)) {
    requestHeaders.set("x-locale", firstSegment);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

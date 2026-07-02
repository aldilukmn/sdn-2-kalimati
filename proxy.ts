import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GRADUATION_ANNOUNCEMENT_DATE = new Date(
  Date.UTC(2026, 5, 2, 5, 0, 0)
);

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard": ["admin", "kepala", "guru"],
  "/data-gtk": ["admin", "kepala"],
  "/data-pendaftar": ["admin", "kepala"],
  "/presensi-murid": ["guru"],
  "/tabungan-murid": ["admin", "kepala", "guru"],
  "/rekap-presensi": ["admin", "kepala", "guru"],
  "/beranda-penjaga": ["penjaga"],
};

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function decodeBase64(str: string): string {
  const bits = str.replace(/=+$/, "").split("").map(c => {
    const idx = BASE64_CHARS.indexOf(c);
    return idx.toString(2).padStart(6, "0");
  }).join("");
  let result = "";
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    result += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
  }
  return result;
}

function decodeJWTPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeBase64(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload) return true;
  if (!payload.exp) return false;
  return payload.exp * 1000 < Date.now();
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("user_session", "", { path: "/", maxAge: 0 });
  return response;
}

function redirectToForbidden(request: NextRequest, role?: string) {
  const target =
    role === "guru" ? "/dashboard" :
    role === "penjaga" ? "/beranda-penjaga" :
    "/";
  return NextResponse.redirect(new URL(target, request.url));
}

export function proxy(request: NextRequest) {
  const now = new Date();
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("user_session")?.value;

  if (pathname === "/login") {
    if (token && !isTokenExpired(token)) {
      const payload = decodeJWTPayload(token);
      const target = payload?.role === "penjaga" ? "/beranda-penjaga" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  const matchedRoute = Object.keys(ROLE_ROUTES).find((r) =>
    pathname === r || pathname.startsWith(r + "/")
  );

  if (matchedRoute) {
    if (!token || isTokenExpired(token)) {
      return redirectToLogin(request);
    }

    const payload = decodeJWTPayload(token);
    if (!payload) {
      return redirectToLogin(request);
    }

    // Admin & kepala dapat akses semua route
    if (payload.role === "admin" || payload.role === "kepala") {
      return NextResponse.next();
    }

    const allowedRoles = ROLE_ROUTES[matchedRoute];
    if (!allowedRoles.includes(payload.role)) {
      return redirectToForbidden(request, payload.role);
    }

    return NextResponse.next();
  }

  if (pathname === "/kelulusan") {
    if (now < GRADUATION_ANNOUNCEMENT_DATE) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/kelulusan",
    "/dashboard/:path*",
    "/data-gtk/:path*",
    "/data-pendaftar/:path*",
    "/presensi-murid/:path*",
    "/tabungan-murid/:path*",
    "/rekap-presensi",
    "/beranda-penjaga",
  ],
};

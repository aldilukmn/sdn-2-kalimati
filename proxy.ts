import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GRADUATION_ANNOUNCEMENT_DATE = new Date(
  Date.UTC(2026, 5, 2, 5, 0, 0)
);

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

export function proxy(request: NextRequest) {
  const now = new Date();
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("user_session")?.value;

  // Proteksi dashboard — blokir guru, expired, corrupted
  if (pathname.startsWith("/dashboard")) {
    if (!token || isTokenExpired(token)) {
      return redirectToLogin(request);
    }

    const payload = decodeJWTPayload(token);
    if (!payload) {
      return redirectToLogin(request);
    }
    if (payload.role === "guru") {
      return NextResponse.redirect(new URL("/presensi-murid", request.url));
    }
  }

  // Proteksi presensi — cek token + expired
  if (pathname === "/presensi") {
    if (!token || isTokenExpired(token)) {
      return redirectToLogin(request);
    }
  }

  // Jika sudah login, tidak boleh ke login lagi
  if (pathname === "/login") {
    if (token) {
      const payload = decodeJWTPayload(token);
      if (payload?.role === "guru") {
        return NextResponse.redirect(new URL("/presensi", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Cek tanggal kelulusan
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
    "/presensi"
  ]
};

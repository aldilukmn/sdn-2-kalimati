import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tanggal dan jam kelulusan: 02 Juni 2026 jam 9 pagi
const GRADUATION_ANNOUNCEMENT_DATE = new Date(
  Date.UTC(2026, 5, 2, 5, 0, 0)
);

export function middleware(request: NextRequest) {
  const now = new Date();
  const pathname = request.nextUrl.pathname;

  // Proteksi dashboard
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("user_session")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  // Jika sudah login, tidak boleh ke login lagi
  if (pathname === "/login") {
    const token =
      request.cookies.get("user_session")?.value;

    if (token) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  // Cek tanggal kelulusan
  if (pathname === "/kelulusan") {
    if (now < GRADUATION_ANNOUNCEMENT_DATE) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/kelulusan",
    "/dashboard/:path*"
  ]
};
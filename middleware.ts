import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tanggal dan jam kelulusan: 02 Juni 2026 jam 9 pagi
const GRADUATION_ANNOUNCEMENT_DATE = new Date(Date.UTC(2026, 5, 2, 5, 0, 0)); // 12:00 WIB = 05:00 UTC

export function middleware(request: NextRequest) {
  const now = new Date();

  if (now < GRADUATION_ANNOUNCEMENT_DATE) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kelulusan"],
};
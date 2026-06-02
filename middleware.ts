import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tanggal dan jam kelulusan: 02 Juni 2026 jam 9 pagi
const GRADUATION_ANNOUNCEMENT_DATE = new Date(2026, 5, 2, 11, 0, 0); // Juni adalah bulan ke-5 (0-indexed)

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
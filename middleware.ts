import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GRADUATION_ANNOUNCEMENT_DATE = new Date(Date.UTC(2026, 5, 2, 5, 0, 0)); // 12:00 WIB = 05:00 UTC

export function middleware(request: NextRequest) {
  const now = new Date();

  console.log("🔍 DEBUG:", {
    now: now.toISOString(),
    deadline: GRADUATION_ANNOUNCEMENT_DATE.toISOString(),
    isAfterDeadline: now >= GRADUATION_ANNOUNCEMENT_DATE,
  });

  if (now < GRADUATION_ANNOUNCEMENT_DATE) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kelulusan"],
};
"use client";

import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { decodeJWT } from "@/lib/jwt";

export interface AuthResult {
  role: string | null;
  grade: string | null;
  userName: string | null;
  user: string | null;
  token: string | null;
  isLoading: boolean;
  payload: Record<string, unknown> | null;
}

export function useAuth(): AuthResult {
  const ctx = useAuthContext();
  let token = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("user_session");
    if (!token) {
      const match = document.cookie.match(new RegExp(`(?:^|;\\s*)user_session=([^;]*)`));
      token = match ? decodeURIComponent(match[1]) : null;
    }
  }
  const payload = token ? decodeJWT(token) : null;

  return {
    role: ctx.userRole,
    grade: ctx.grade,
    userName: ctx.userName,
    user: ctx.user,
    token,
    isLoading: ctx.isLoading,
    payload,
  };
}

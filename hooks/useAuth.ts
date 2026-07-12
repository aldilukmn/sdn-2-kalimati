"use client";

import { useAuth as useAuthContext } from "@/app/contexts/AuthContext";
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
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user_session")
      : null;
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

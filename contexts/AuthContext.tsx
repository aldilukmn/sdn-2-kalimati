"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  userRole: string | null;
  isLoading: boolean;
  grade: string | null;
  user: string | null;
  userName: string | null;
}

interface AuthState {
  userRole: string | null;
  grade: string | null;
  user: string | null;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  isLoading: true,
  grade: null,
  user: null,
  userName: null,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readAuthState(): AuthState {
  // sessionStorage takes priority; fall back to cookies (fresh tab / new window)
  const sessionRole = sessionStorage.getItem("user_role");
  const sessionUser = sessionStorage.getItem("user_identifier");
  const sessionGrade = sessionStorage.getItem("user_grade");
  const sessionName = sessionStorage.getItem("user_fullName");

  const cookieRole = getCookie("user_role") || null;
  const cookieUser = getCookie("user_identifier") || null;
  const cookieGrade = getCookie("user_grade") || null;
  const cookieName = getCookie("user_fullName") || null;

  return {
    userRole: sessionRole || cookieRole,
    user: sessionUser || cookieUser,
    // Treat empty string as null so guru with no grade doesn't leak admin's ""
    grade: (sessionGrade || cookieGrade) || null,
    userName: sessionName || cookieName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    userRole: null,
    grade: null,
    user: null,
    userName: null,
  });

  const refresh = useCallback(() => {
    const state = readAuthState();
    setAuthState(state);
    setIsLoading(!state.userRole);
  }, []);

  useEffect(() => {
    // Initial read after hydration
    refresh();

    // Re-read whenever login/logout dispatches this event
    window.addEventListener("auth-update", refresh);
    return () => window.removeEventListener("auth-update", refresh);
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ ...authState, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  userRole: string | null;
  isLoading: boolean;
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
  return match ? match[1] : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // sessionStorage (login session), guarded for SSR
  const sessionRole = hydrated ? sessionStorage.getItem("user_role") : null;
  const sessionUser = hydrated ? sessionStorage.getItem("user_identifier") : null;
  const sessionGrade = hydrated ? sessionStorage.getItem("user_grade") : null;
  const sessionName = hydrated ? sessionStorage.getItem("user_fullName") : null;

  // cookie fallback (fresh tab where sessionStorage is empty)
  const cookieRole = hydrated ? decodeURIComponent(getCookie("user_role") || "") || null : null;
  const cookieUser = hydrated ? decodeURIComponent(getCookie("user_identifier") || "") || null : null;
  const cookieGrade = hydrated ? decodeURIComponent(getCookie("user_grade") || "") || null : null;
  const cookieName = hydrated ? decodeURIComponent(getCookie("user_fullName") || "") || null : null;

  const userRole = sessionRole || cookieRole;
  const user = sessionUser || cookieUser;
  const storedGrade = sessionGrade || cookieGrade;
  const userName = sessionName || cookieName;
  const hasData = !!(sessionRole || cookieRole);

  return (
    <AuthContext.Provider value={{ userRole, isLoading: !hasData, grade: storedGrade, user, userName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

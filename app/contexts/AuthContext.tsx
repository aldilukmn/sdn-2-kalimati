"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AuthContextType {
  userRole: string | null;
  isLoading: boolean;
  grade: string | null;
  user: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  isLoading: true,
  grade: null,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const userRole = hydrated
    ? (typeof window !== "undefined" ? sessionStorage.getItem("user_role") : null)
    : null;
  const user = hydrated
    ? (typeof window !== "undefined" ? sessionStorage.getItem("user_identifier") : null)
    : null;
  const storedGrade = hydrated
    ? (typeof window !== "undefined" ? sessionStorage.getItem("user_grade") : null)
    : null;

  return (
    <AuthContext.Provider value={{ userRole, isLoading: !hydrated, grade: storedGrade, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

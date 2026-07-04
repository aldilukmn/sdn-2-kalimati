"use client";

import { useEffect, ReactNode } from "react";

const STORAGE_KEY = "sdn2-theme";

export default function ThemeProvider({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
      try {
        window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
      } catch {
        /* noop */
      }
    };

    applyTheme(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return <>{children}</>;
}

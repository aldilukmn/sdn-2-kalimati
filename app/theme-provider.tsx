"use client";

import { useEffect, useState, ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "sdn2-theme";

type ThemeMode = "light" | "dark";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

export default function ThemeProvider({ children }: { children?: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !theme) return;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const buttonStyles =
    theme !== "dark"
      ? "inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/95 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-slate-800"
      : "inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition duration-300 hover:bg-slate-100";

  return (
    <>
      {mounted && theme && (
        <div className="absolute top-5 right-4 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className={`${buttonStyles} cursor-pointer text-xs md:text-sm pointer-events-auto`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
      {children}
    </>
  );
}

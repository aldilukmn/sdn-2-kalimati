"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import AuthService from "@/services/auth.service";

function parseJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const ROLE_STYLES: Record<string, { bg: string; label: string }> = {
  admin: { bg: "bg-indigo-500", label: "Admin" },
  guru: { bg: "bg-emerald-500", label: "Guru" },
  kepala: { bg: "bg-purple-500", label: "Kepala Sekolah" },
  penjaga: { bg: "bg-amber-500", label: "Penjaga" },
};

const DEFAULT_ROLE_STYLE = ROLE_STYLES.admin;

export default function LogoutButton() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string; initial: string; roleStyle: { bg: string; label: string } }>({
    fullName: "User",
    role: "admin",
    initial: "U",
    roleStyle: DEFAULT_ROLE_STYLE,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      const payload = parseJWT(token);
      if (payload) {
        const fullName = payload.fullName || "User";
        const role: string = payload.role || "admin";
        setUser({
          fullName,
          role,
          initial: fullName.charAt(0).toUpperCase(),
          roleStyle: ROLE_STYLES[role] || DEFAULT_ROLE_STYLE,
        });
      }
    }
    setLoaded(true);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch {
      // proceed with local logout regardless
    } finally {
      sessionStorage.removeItem("user_session");
      sessionStorage.removeItem("user_identifier");
      sessionStorage.removeItem("user_role");
      sessionStorage.removeItem("user_grade");
      document.cookie = "user_session=; path=/; max-age=0";
      router.replace("/login");
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="hidden md:block space-y-1.5">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0 ${user.roleStyle.bg}`}>
          {user.initial}
        </div>
        <div className="hidden md:block leading-tight">
          <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none mb-1">{user.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">{user.roleStyle.label}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        title="Logout"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <LogOut size={20} />
        )}
      </button>
    </div>
  );
}

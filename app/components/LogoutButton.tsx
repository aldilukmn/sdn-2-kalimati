"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, User } from "lucide-react";
import AuthService from "@/services/auth.service";
import toast from "react-hot-toast";
import { decodeJWT } from "@/lib/jwt";

import { useAuth } from "@/hooks/useAuth";

const ROLE_STYLES: Record<string, { bg: string; label: string }> = {
  admin: { bg: "bg-indigo-500", label: "Admin" },
  guru: { bg: "bg-emerald-500", label: "Guru" },
  kepala: { bg: "bg-purple-500", label: "Kepala Sekolah" },
  penjaga: { bg: "bg-amber-500", label: "Penjaga" },
};

const DEFAULT_ROLE_STYLE = ROLE_STYLES.admin;

export default function LogoutButton() {
  const router = useRouter();
  const { role, userName, payload, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = {
    fullName: userName || "User",
    role: role || "admin",
    initial: (userName || "User").charAt(0).toUpperCase(),
    roleStyle: ROLE_STYLES[role || "admin"] || DEFAULT_ROLE_STYLE,
    image_url: payload?.image_url as string | undefined,
  };

  // loaded state untuk mencegah hydration mismatch / render sebelum auth beres
  const loaded = !authLoading;

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch {
      // proceed with local logout regardless
    } finally {
      toast.success("Sampai jumpa!");
      await new Promise((r) => setTimeout(r, 1500));
      sessionStorage.removeItem("user_session");
      sessionStorage.removeItem("user_identifier");
      sessionStorage.removeItem("user_role");
      sessionStorage.removeItem("user_grade");
      sessionStorage.removeItem("user_fullName");
      document.cookie = "user_session=; path=/; max-age=0";
      document.cookie = "user_role=; path=/; max-age=0";
      document.cookie = "user_grade=; path=/; max-age=0";
      document.cookie = "user_fullName=; path=/; max-age=0";
      document.cookie = "user_identifier=; path=/; max-age=0";

      // Notify AuthContext to clear its cached state
      window.dispatchEvent(new Event("auth-update"));

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
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 md:gap-3 group cursor-pointer"
      >
        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shrink-0 overflow-hidden ${user.roleStyle.bg} ring-2 ring-transparent group-hover:ring-indigo-400 transition-all`}>
          {user.image_url ? (
            <img src={user.image_url} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            user.initial
          )}
        </div>
        <div className="hidden md:block leading-tight text-left">
          <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none mb-1">{user.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">{user.roleStyle.label}</p>
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 transition-all duration-100 opacity-100 translate-y-0">
          <button
            onClick={() => { setDropdownOpen(false); router.push("/profil"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <User size={16} />
            Profil
          </button>
          <div className="border-t border-slate-200 dark:border-slate-700" />
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

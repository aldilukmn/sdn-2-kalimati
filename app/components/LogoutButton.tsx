"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import AuthService from "@/services/auth.service";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      document.cookie = "user_session=; path=/; max-age=0";
      router.replace("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <LogOut size={20} />
      )}
      <span className="text-sm font-medium">
        {isLoading ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}

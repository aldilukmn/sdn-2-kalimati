"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import AuthService from "@/services/auth.service";
import toast from "react-hot-toast";

export default function BerandaPenjaga() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    setSubmitting(true);
    try {
      await AuthService.logout();
    } catch {
      // proceed with local logout
    }
    toast.success("Sampai jumpa!");
    await new Promise((r) => setTimeout(r, 1500));
    sessionStorage.clear();
    document.cookie = "user_session=; path=/; max-age=0";
    document.cookie = "user_identifier=; path=/; max-age=0";
    document.cookie = "user_fullName=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    document.cookie = "user_grade=; path=/; max-age=0";
    router.replace("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 min-h-[60vh]">
      <div className="text-6xl">🏫</div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Selamat Datang
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        Halaman ini khusus untuk penjaga. Saat ini belum ada fitur yang tersedia.
      </p>
      <button
        onClick={handleLogout}
        disabled={submitting}
        className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        {submitting ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

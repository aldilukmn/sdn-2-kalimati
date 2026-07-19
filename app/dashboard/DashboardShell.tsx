"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

interface Props {
  children: React.ReactNode;
  userRole?: string | null;
  userName?: string | null;
  userGrade?: string | null;
}

export default function DashboardShell({
  children,
  userRole = null,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !role) {
      router.replace("/");
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    if (!pathname) return;
    const titleOverrides: Record<string, string> = {
      "/data-gtk": "Data GTK",
      "/konfigurasi-kaih": "Konfigurasi KAIH",
      "/nilai-litnum": "Nilai LitNum",
    };

    let title = "Dashboard";
    if (titleOverrides[pathname]) {
      title = titleOverrides[pathname];
    } else if (pathname !== "/" && pathname !== "/dashboard") {
      const slug = pathname.split("/").pop() || "";
      title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    
    document.title = `${title} - SDN 2 Kalimati`;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
      />

      <div className="flex flex-col min-h-screen md:pl-64">
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

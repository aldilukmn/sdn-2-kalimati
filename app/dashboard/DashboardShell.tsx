"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import DashboardNavbar from "@/app/components/DashboardNavbar";

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
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !role) {
      router.replace("/login");
    }
  }, [isLoading, role, router]);

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

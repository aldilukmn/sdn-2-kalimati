"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import DashboardNavbar from "@/app/components/DashboardNavbar";

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch {}
    }
  }, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={toggleCollapse}
        userRole={userRole}
      />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "md:pl-0" : "md:pl-64"
        }`}
      >
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

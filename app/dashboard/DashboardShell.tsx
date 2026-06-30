"use client";

import { useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import { useAuth } from "@/app/contexts/AuthContext";

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userRole } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

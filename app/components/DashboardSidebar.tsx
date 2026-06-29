"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Data GTK", icon: Users, href: "/data-gtk" },
  { label: "Data Pendaftar", icon: ClipboardList, href: "/data-pendaftar" },
  { label: "Presensi Murid", icon: CalendarCheck, href: "/presensi-murid" },
];

const penjagaMenuItems = [
  { label: "Beranda", icon: LayoutDashboard, href: "/beranda-penjaga" },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  userRole: string | null;
}

export default function DashboardSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();

  const filteredMenuItems = useMemo(() => {
    if (userRole === "guru") {
      return menuItems.filter((item) => item.href === "/dashboard" || item.href === "/presensi-murid");
    }
    if (userRole === "penjaga") {
      return penjagaMenuItems;
    }
    return menuItems;
  }, [userRole]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {!isOpen && isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center justify-center w-6 h-20 bg-slate-800 dark:bg-slate-900 text-white rounded-r-lg shadow-lg hover:bg-slate-700 transition-all cursor-pointer group"
          title="Tampilkan sidebar"
        >
          <ChevronRight size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-slate-800 dark:bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:-translate-x-full" : "md:translate-x-0"}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <span className="text-lg font-bold tracking-wide">Menu</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              title="Sembunyikan sidebar"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
          SDN 2 Kalimati &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Users,
  Wallet,
  BookOpen,
  X,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Mapel & Struktur", icon: BookOpen, href: "/master-mapel" },
  { label: "Data GTK", icon: Users, href: "/data-gtk" },
  { label: "Data Pendaftar", icon: ClipboardList, href: "/data-pendaftar" },
  { label: "Presensi Murid", icon: CalendarCheck, href: "/presensi-murid" },
  { label: "Tabungan Murid", icon: Wallet, href: "/tabungan-murid" },
];

const penjagaMenuItems = [
  { label: "Beranda", icon: LayoutDashboard, href: "/beranda-penjaga" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string | null;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();

  const filteredMenuItems = useMemo(() => {
    if (userRole === null) return [];
    if (userRole === "guru") {
      return menuItems.filter(
        (item) =>
          item.href === "/dashboard" ||
          item.href === "/presensi-murid" ||
          item.href === "/tabungan-murid",
      );
    }
    if (userRole === "kepala") {
      return menuItems;
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-slate-100/90 dark:bg-slate-800/90 md:backdrop-blur-xl
          border-r border-slate-200 dark:border-slate-700
          text-slate-700 dark:text-slate-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-indigo-300 dark:border-slate-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 shrink-0 rounded-lg flex items-center justify-center shadow-md animate-iconBounce">
              <img
                src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
                alt="logo-sekolah"
              />
            </div>
            <span className="text-sm font-bold tracking-wide truncate">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                SDN 2 Kalimati
              </span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-indigo-500/50 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300 border-r-2 border-indigo-500 dark:border-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200"
                  }
                `}
              >
                <Icon size={19} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-indigo-300 dark:border-slate-700 text-[11px] text-slate-400 dark:text-slate-500">
          SDN 2 Kalimati &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}

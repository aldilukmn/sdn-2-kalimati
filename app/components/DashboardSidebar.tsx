"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AssessmentConfigService from "@/services/assessment-config.service";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Users,
  Wallet,
  BookOpen,
  ClipboardEdit,
  ScrollText,
  Scale,
  Calculator,
  BarChart3,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  ListChecks,
  UserCog,
  PieChart,
  FileEdit,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

type MenuGroup = {
  label: string;
  icon: LucideIcon;
  children: MenuItem[];
};

type SidebarItem = MenuItem | MenuGroup;

const menuItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Presensi",
    icon: CalendarCheck,
    children: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard-presensi" },
      { label: "Input Presensi", icon: CalendarCheck, href: "/presensi-murid" },
    ],
  },
  { label: "Tabungan Murid", icon: Wallet, href: "/tabungan-murid" },
  { label: "Daftar Mapel", icon: BookOpen, href: "/daftar-mapel" },
  {
    label: "Nilai Akademik",
    icon: GraduationCap,
    children: [
      { label: "Nilai Harian", icon: ClipboardEdit, href: "/nilai-harian" },
      {
        label: "Rekap Nilai Harian",
        icon: ScrollText,
        href: "/rekap-nilai-harian",
      },
      { label: "Nilai Tugas", icon: FileEdit, href: "/nilai-tugas" },
      { label: "Nilai LitNum", icon: PieChart, href: "/nilai-litnum" },
      { label: "Komponen Nilai", icon: ClipboardList, href: "/komponen-nilai" },
      { label: "Nilai Akhir", icon: Calculator, href: "/nilai-akhir" },
      {
        label: "Rekap Nilai Akhir",
        icon: BarChart3,
        href: "/rekap-nilai-akhir",
      },
      { label: "Konfigurasi Nilai", icon: Scale, href: "/konfigurasi-nilai" },
    ],
  },
  {
    label: "Nilai Karakter",
    icon: ListChecks,
    children: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard-karakter",
      },
      { label: "Penilaian", icon: ClipboardEdit, href: "/penilaian-karakter" },
      { label: "Rekapitulasi", icon: ClipboardList, href: "/rekap-karakter" },
      { label: "Konfigurasi KAIH", icon: Scale, href: "/konfigurasi-kaih" },
    ],
  },
  { label: "Data GTK", icon: Users, href: "/data-gtk" },
  { label: "Data Pendaftar", icon: ClipboardList, href: "/data-pendaftar" },
  { label: "Profil Saya", icon: UserCog, href: "/profil" },
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Nilai Akademik": true,
    Karakter: true,
  });
  const [showLitnum, setShowLitnum] = useState(false);

  useEffect(() => {
    if (!userRole) return;
    AssessmentConfigService.getAll()
      .then((res) => {
        const configs = res?.result || [];
        const hasLitnum = configs.some((cfg) =>
          cfg.components.some((c) => c.key === "litnum")
        );
        setShowLitnum(hasLitnum);
      })
      .catch(() => {});
  }, [userRole]);

  const guruAllowedHrefs = new Set([
    "/dashboard",
    "/dashboard-karakter",
    "/dashboard-presensi",
    "/penilaian-karakter",
    "/rekap-karakter",
    "/nilai-harian",
    "/nilai-tugas",
    "/nilai-litnum",
    "/komponen-nilai",
    "/rekap-nilai-harian",
    "/rekap-nilai-akhir",
    "/nilai-akhir",
    "/daftar-mapel",
    "/presensi-murid",
    "/tabungan-murid",
    "/profil",
  ]);

  const isItemAllowed = (item: SidebarItem): boolean => {
    if ("href" in item) return guruAllowedHrefs.has(item.href);
    return item.children.some((c) => guruAllowedHrefs.has(c.href));
  };

  const filteredMenuItems = useMemo(() => {
    if (userRole === null) return [];
    
    let baseMenu = menuItems;
    if (userRole === "penjaga") return penjagaMenuItems;
    
    if (!showLitnum) {
      baseMenu = baseMenu.map((item) => {
        if ("children" in item) {
          return {
            ...item,
            children: item.children.filter((c) => c.href !== "/nilai-litnum"),
          };
        }
        return item;
      });
    }

    if (userRole === "guru") return baseMenu.filter(isItemAllowed);
    return baseMenu;
  }, [userRole, showLitnum]);

  const isActive = (href: string) => {
    if (href === "/daftar-mapel") {
      return pathname === "/daftar-mapel" || pathname === "/kelola-mapel";
    }
    if (href === "/nilai-harian") {
      return pathname === "/nilai-harian";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (group: MenuGroup) =>
    group.children.some((c) => isActive(c.href));

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
          bg-slate-100/90 dark:bg-slate-800/90 md:backdrop-blur-md
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
            if ("children" in item) {
              const group = item as MenuGroup;
              const groupIsOpen = openGroups[group.label] ?? true;
              const active = isGroupActive(group);
              const Icon = group.icon;
              return (
                <div key={group.label}>
                  <button
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [group.label]: !prev[group.label],
                      }))
                    }
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-indigo-500/50 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300 border-r-2 border-indigo-500 dark:border-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon size={19} className="shrink-0" />
                    <span className="flex-1 text-left">{group.label}</span>
                    {groupIsOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  <div
                    className={`ml-5 mt-0.5 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 ${
                      groupIsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {group.children
                      .filter(
                        (child) =>
                          userRole !== "guru" ||
                          guruAllowedHrefs.has(child.href),
                      )
                      .map((child) => {
                        const childActive = isActive(child.href);
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
                              childActive
                                ? "bg-indigo-500/50 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300 border-r-2 border-indigo-500 dark:border-indigo-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <ChildIcon size={16} className="shrink-0" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            }
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarData } from "@/hooks/useSidebarData";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MenuGroup } from "@/lib/constants/menu";

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
  const { grade: userGrade } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Nilai Akademik": true,
    Karakter: true,
  });

  const { filteredMenuItems, guruAllowedHrefs } = useSidebarData(userRole, userGrade);

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
                    className={`ml-5 mt-0.5 border-l-2 border-slate-300 dark:border-slate-700 grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      groupIsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden space-y-0.5 flex flex-col">
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

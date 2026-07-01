"use client";

import { Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-100/80 dark:bg-slate-800/80 md:backdrop-blur-xl border-b border-indigo-300 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            aria-label="Buka menu"
          >
            <Menu size={22} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

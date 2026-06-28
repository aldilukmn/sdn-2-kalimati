"use client";

import { Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Buka menu"
          >
            <Menu size={22} className="text-slate-700 dark:text-slate-200" />
          </button>
          {/* <div className='flex gap-5 items-center'>
            <img
              src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
              alt="logo-sekolah"
              className="w-14"
            />
            <h1 className="text-lg flex-1 font-semibold text-slate-800 dark:text-white text-nowrap">
              SDN 2 Kalimati
            </h1>
          </div> */}
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

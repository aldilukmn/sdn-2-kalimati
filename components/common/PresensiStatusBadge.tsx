"use client";

import { UserCheck, Clock, FileText, UserX } from "lucide-react";

interface StatusCardItem {
  key: string;
  label: string;
  icon: React.ElementType;
  cardBg: string;
  iconBg: string;
  textClass: string;
  skeletonClass: string;
}

const ITEMS: StatusCardItem[] = [
  {
    key: "hadir",
    label: "Hadir",
    icon: UserCheck,
    cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30",
    iconBg: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    skeletonClass: "bg-emerald-300 dark:bg-emerald-600",
  },
  {
    key: "sakit",
    label: "Sakit",
    icon: Clock,
    cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30",
    iconBg: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    skeletonClass: "bg-amber-300 dark:bg-amber-600",
  },
  {
    key: "izin",
    label: "Izin",
    icon: FileText,
    cardBg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30",
    iconBg: "bg-blue-500",
    textClass: "text-blue-600 dark:text-blue-400",
    skeletonClass: "bg-blue-300 dark:bg-blue-600",
  },
  {
    key: "absen",
    label: "Absen",
    icon: UserX,
    cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
    iconBg: "bg-red-500",
    textClass: "text-red-600 dark:text-red-400",
    skeletonClass: "bg-red-300 dark:bg-red-600",
  },
];

interface Props {
  loading: boolean;
  countByStatus: (status: string) => number;
}

export default function PresensiStatusBadge({ loading, countByStatus }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={`border ${item.cardBg}  rounded-xl px-3.5 py-2.5 flex items-center gap-3`}
          >
            <div
              className={`w-9 h-9 ${item.iconBg} rounded-lg flex items-center justify-center shadow-sm`}
            >
              <Icon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight">
                {item.label}
              </p>
              {loading ? (
                <div
                  className={`h-5 w-8 rounded mt-0.5 ${item.skeletonClass}`}
                />
              ) : (
                <p
                  className={`text-lg font-bold ${item.textClass} leading-none`}
                >
                  {countByStatus(item.key)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

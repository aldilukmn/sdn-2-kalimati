"use client";

import { UserCheck, UserX, Clock, FileText } from "lucide-react";

interface StatusBadgeItem {
  key: string;
  label: string;
  icon: React.ElementType;
  bg: string;
  skeletonBg: string;
}

const ITEMS: StatusBadgeItem[] = [
  {
    key: "hadir",
    label: "Hadir",
    icon: UserCheck,
    bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    skeletonBg: "bg-green-300 dark:bg-green-600",
  },
  {
    key: "sakit",
    label: "Sakit",
    icon: Clock,
    bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    skeletonBg: "bg-yellow-300 dark:bg-yellow-600",
  },
  {
    key: "izin",
    label: "Izin",
    icon: FileText,
    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    skeletonBg: "bg-blue-300 dark:bg-blue-600",
  },
  {
    key: "alpha",
    label: "Alpha",
    icon: UserX,
    bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    skeletonBg: "bg-red-300 dark:bg-red-600",
  },
];

interface Props {
  loading: boolean;
  countByStatus: (status: string) => number;
}

export default function PresensiStatusBadge({ loading, countByStatus }: Props) {
  return (
    <div className="grid grid-cols-4 flex-wrap gap-3">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            className={`flex flex-col md:flex-row items-center gap-1 text-xs px-2.5 py-1 rounded-full ${item.bg}`}
          >
            <Icon size={14} /> {item.label}:{" "}
            {loading ? (
              <span
                className={`inline-block h-3 w-5 rounded animate-pulse align-middle ${item.skeletonBg}`}
              />
            ) : (
              countByStatus(item.key)
            )}
          </span>
        );
      })}
    </div>
  );
}

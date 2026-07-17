export const API_URL =
  "https://api-sdn-2-kalimati.vercel.app/api";

export const GRADES = ["1", "2", "3", "4", "5", "6"];
export const ITEMS_PER_PAGE = 5;
export const SEMESTERS = ["1", "2"];
export const ACADEMIC_YEARS = ["2026/2027"];
export const HISTORY_LIMIT = 10;
export const MONTHLY_PER_PAGE = 5;
export const AVAILABLE_YEARS = [2026, 2027];

export const CUSTOM_KEY = "__kustom__";

export interface ConfigPreset {
  key: string;
  name: string;
  type: "system" | "manual";
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  { key: "harian", name: "Harian", type: "system" },
  { key: "karakter", name: "Karakter", type: "system" },
  { key: "presensi", name: "Presensi", type: "system" },
  { key: "tugas", name: "Tugas", type: "system" },
  { key: "litnum", name: "Literasi & Numerasi", type: "system" },
  { key: "asts", name: "ASTS", type: "manual" },
  { key: "asas", name: "ASAS", type: "manual" },
];

export const COMPONENT_COLORS = [
  "text-indigo-600 dark:text-indigo-300",
  "text-emerald-600 dark:text-emerald-300",
  "text-amber-600 dark:text-amber-300",
  "text-rose-600 dark:text-rose-300",
  "text-cyan-600 dark:text-cyan-300",
  "text-purple-600 dark:text-purple-300",
  "text-orange-600 dark:text-orange-300",
  "text-teal-600 dark:text-teal-300",
];

export const COMPONENT_BGS = [
  "bg-indigo-500 dark:bg-indigo-400",
  "bg-emerald-500 dark:bg-emerald-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-rose-500 dark:bg-rose-400",
  "bg-cyan-500 dark:bg-cyan-400",
  "bg-purple-500 dark:bg-purple-400",
  "bg-orange-500 dark:bg-orange-400",
  "bg-teal-500 dark:bg-teal-400",
];

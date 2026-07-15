export const API_URL =
  "https://api-sdn-2-kalimati.vercel.app/api";

export const GRADES = ["1", "2", "3", "4", "5", "6"];
export const ITEMS_PER_PAGE = 5;
export const SEMESTERS = ["1", "2"];
export const ACADEMIC_YEARS = ["2026/2027"];
export const HISTORY_LIMIT = 10;
export const MONTHLY_PER_PAGE = 5;
export const AVAILABLE_YEARS = [2026, 2027];

export interface ConfigPreset {
  key: string;
  name: string;
  type: "system" | "manual";
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  { key: "harian", name: "Nilai Harian", type: "system" },
  { key: "karakter", name: "Nilai Karakter", type: "system" },
  { key: "presensi", name: "Presensi", type: "system" },
  { key: "asts", name: "ASTS", type: "manual" },
  { key: "asas", name: "ASAS", type: "manual" },
];

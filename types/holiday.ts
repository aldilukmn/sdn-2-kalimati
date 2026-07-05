export interface Holiday {
  date: string;
  description: string;
  type: "national" | "sunday";
}

export interface HolidayCheckResult {
  isHoliday: boolean;
  holiday: Holiday | null;
}

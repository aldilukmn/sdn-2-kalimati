import { api } from "@/lib/api";
import type { Holiday, HolidayCheckResult } from "@/types/holiday";

export default class HolidayService {
  static async getAll() {
    return await api<Holiday[]>("/holidays");
  }

  static async check(date: string) {
    return await api<HolidayCheckResult>(`/holidays/check?date=${date}`);
  }

  static async add(data: { date: string; description: string; type?: string }) {
    return await api<Holiday>("/holidays", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async remove(date: string) {
    return await api<void>(`/holidays/${date}`, {
      method: "DELETE",
    });
  }
}

import { api } from "@/lib/api";

export default class HolidayService {
  static async getAll(): Promise<{ date: string; description: string; type: string }[]> {
    const res = await api("/holidays");
    return res?.result || [];
  }

  static async add(data: { date: string; description: string; type?: string }) {
    return await api("/holidays", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async remove(date: string) {
    return await api(`/holidays/${date}`, {
      method: "DELETE",
    });
  }
}

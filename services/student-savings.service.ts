import { api } from "@/lib/api";

export default class StudentSavingsService {
  static async getByGrade(grade: string, date?: string) {
    let url = `/student-savings?grade=${grade}`;
    if (date) url += `&date=${date}`;
    return await api(url);
  }

  static async getSummary(grade: string, date: string) {
    return await api(
      `/student-savings/summary?grade=${grade}&date=${date}`
    );
  }

  static async createTransaction(data: {
    studentId: string;
    type: "simpan" | "tarik";
    amount: number;
    date: string;
    description?: string;
  }) {
    return await api("/student-savings/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateTransaction(
    id: string,
    data: {
      type?: "simpan" | "tarik";
      amount?: number;
      date?: string;
      description?: string;
    }
  ) {
    return await api(`/student-savings/transaction/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async deleteTransaction(id: string) {
    return await api(`/student-savings/transaction/${id}`, {
      method: "DELETE",
    });
  }

  static async getMonthlyRecap(grade: string | undefined, month: number, year: number) {
    let url = `/student-savings/monthly-recap?month=${month}&year=${year}`;
    if (grade) url += `&grade=${grade}`;
    return await api(url);
  }

  static async getMonthlyBreakdown(grade: string, year: number) {
    return await api(`/student-savings/monthly-breakdown?grade=${grade}&year=${year}`);
  }

  static async getTransactions(
    studentId: string,
    page?: number,
    limit?: number,
    type?: string,
    month?: number,
    year?: number
  ) {
    const params = new URLSearchParams({ studentId });
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (type) params.set("type", type);
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    return await api(`/student-savings/transactions?${params.toString()}`);
  }
}

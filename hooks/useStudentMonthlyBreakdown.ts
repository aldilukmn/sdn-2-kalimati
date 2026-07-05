"use client";

import { useState, useEffect } from "react";
import StudentSavingsService from "@/services/student-savings.service";

export interface StudentMonthlyData {
  studentId: string;
  name: string;
  grade: string;
  balance: number;
  months: Record<string, number>;
  totalWithdrawn: number;
}

export function useStudentMonthlyBreakdown(grade: string, year: number, refreshKey?: number) {
  const [data, setData] = useState<StudentMonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grade || !year) return;
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    StudentSavingsService.getMonthlyBreakdown(grade, year)
      .then((res) => {
        if (signal.aborted) return;
        const result = res?.data || res?.result || [];
        setData(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (!signal.aborted) setData([]);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [grade, year, refreshKey]);

  return { data, loading };
}

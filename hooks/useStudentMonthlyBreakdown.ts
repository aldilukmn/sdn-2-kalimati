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
    let cancelled = false;
    setLoading(true);
    StudentSavingsService.getMonthlyBreakdown(grade, year)
      .then((res) => {
        if (cancelled) return;
        const result = res?.data || res?.result || [];
        setData(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [grade, year, refreshKey]);

  return { data, loading };
}

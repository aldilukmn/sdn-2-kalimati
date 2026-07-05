"use client";

import { useEffect, useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";

export interface SavingsRecap {
  totalBalance: number;
  totalStudents: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
}

export function useSavingsRecap(
  grade: string | undefined,
  month: number,
  year: number
) {
  const [data, setData] = useState<SavingsRecap | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getMonthlyRecap(grade, month, year);
        if (!signal.aborted) {
          setData(res?.result || null);
        }
      } catch {
        if (!signal.aborted) setData(null);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [grade, month, year]);

  return { data, loading };
}

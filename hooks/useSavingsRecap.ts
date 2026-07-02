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
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getMonthlyRecap(grade, month, year);
        if (!cancelled) {
          setData(res?.result || null);
        }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [grade, month, year]);

  return { data, loading };
}

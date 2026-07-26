"use client";

import { useEffect, useState, useCallback } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export interface WeeklyRecapData {
  date: string;
  recap: GradeRecap | null;
}

export interface WeeklyRecapResult {
  monthlyData: WeeklyRecapData[];
  monthlySummary: { deposits: number; withdrawals: number };
}

export function useWeeklyRecap(endDate: string, grade: string, refreshKey?: number) {
  const [data, setData] = useState<WeeklyRecapResult>({ monthlyData: [], monthlySummary: { deposits: 0, withdrawals: 0 } });
  const [loading, setLoading] = useState(true);

  const end = new Date(endDate);
  const year = end.getFullYear();
  const month = end.getMonth();

  const fetchData = useCallback(async () => {
    try {
      const numDays = new Date(year, month + 1, 0).getDate();
      
      const datesToFetch: string[] = [];
      for (let i = 1; i <= numDays; i++) {
        const y = year;
        const m = String(month + 1).padStart(2, '0');
        const day = String(i).padStart(2, '0');
        datesToFetch.push(`${y}-${m}-${day}`);
      }
      
      const startDate = datesToFetch[0];
      const monthEndDate = datesToFetch[datesToFetch.length - 1];

      const res = await StudentSavingsService.getWeeklyRecap(startDate, monthEndDate, grade);
      const rawData = res.result || [];

      const results: WeeklyRecapData[] = datesToFetch.map((date) => {
        const found = rawData.find((r) => r.date === date);
        if (found) {
          return {
            date,
            recap: {
              grade: found.grade || grade || "",
              totalStudents: found.totalStudents,
              deposits: found.deposits,
              withdrawals: found.withdrawals,
              totalBalance: 0, // Not needed for weekly trend
            },
          };
        }
        return { date, recap: null };
      });
      const monthlySummary = results.reduce(
        (acc, curr) => {
          if (curr.recap) {
            acc.deposits += curr.recap.deposits;
            acc.withdrawals += curr.recap.withdrawals;
          }
          return acc;
        },
        { deposits: 0, withdrawals: 0 }
      );
      const monthlyData = results.reverse();
      return { monthlyData, monthlySummary };
    } catch {
      return { monthlyData: [], monthlySummary: { deposits: 0, withdrawals: 0 } };
    }
  }, [year, month, grade]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchData();
      setData(result);
    } catch {
      setData({ monthlyData: [], monthlySummary: { deposits: 0, withdrawals: 0 } });
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;
    
    if (!grade) {
      setLoading(true);
      return () => { cancelled = true; };
    }

    (async () => {
      setLoading(true);
      try {
        const result = await fetchData();
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData({ monthlyData: [], monthlySummary: { deposits: 0, withdrawals: 0 } });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchData, grade]);

  useEffect(() => {
    if (refreshKey === undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchData();
        if (!cancelled) setData(result);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [refreshKey, fetchData]);

  return { data, loading, refresh };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export interface WeeklyRecapData {
  date: string;
  recap: GradeRecap | null;
}

export function useWeeklyRecap(endDate: string, grade: string, refreshKey?: number) {
  const [data, setData] = useState<WeeklyRecapData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const datesToFetch: string[] = [];
    const end = new Date(endDate);
    for (let i = 0; i < 6; i++) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      datesToFetch.push(d.toISOString().split("T")[0]);
    }

    const results = await Promise.all(
      datesToFetch.map(async (date) => {
        try {
          const res = await StudentSavingsService.getGradeRecap(date);
          const recaps: GradeRecap[] = res?.result || [];
          let recapData: GradeRecap | null = null;
          if (grade) {
            recapData = recaps.find((r) => r.grade === grade) || null;
          } else if (recaps.length > 0) {
            recapData = recaps.reduce(
              (acc, curr) => {
                acc.deposits += curr.deposits;
                acc.withdrawals += curr.withdrawals;
                acc.totalStudents += curr.totalStudents;
                acc.totalBalance += curr.totalBalance;
                return acc;
              },
              { grade: "", totalStudents: 0, deposits: 0, withdrawals: 0, totalBalance: 0 }
            );
          }
          return { date, recap: recapData };
        } catch {
          return { date, recap: null };
        }
      })
    );
    return results.reverse(); // oldest to newest
  }, [endDate, grade]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchData();
      setData(result);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchData();
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchData]);

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

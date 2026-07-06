"use client";

import { useEffect, useState, useCallback } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export function useGradeRecap(date?: string, month?: number, year?: number, refreshKey?: number) {
  const [data, setData] = useState<GradeRecap[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await StudentSavingsService.getGradeRecap(date, month, year);
      setData(res?.result || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [date, month, year]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const res = await StudentSavingsService.getGradeRecap(date, month, year);
        if (!cancelled) setData(res?.result || []);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [date, month, year, refreshKey]);

  return { data, loading, refresh };
}

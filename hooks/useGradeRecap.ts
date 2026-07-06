"use client";

import { useEffect, useState, useCallback } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export function useGradeRecap(date?: string, month?: number, year?: number) {
  const [data, setData] = useState<GradeRecap[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
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
      setLoading(true);
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
  }, [date, month, year]);

  return { data, loading, refresh };
}

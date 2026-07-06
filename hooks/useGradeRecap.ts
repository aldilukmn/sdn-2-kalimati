"use client";

import { useEffect, useState, useCallback } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export function useGradeRecap(date?: string, month?: number, year?: number, refreshKey?: number) {
  const [data, setData] = useState<GradeRecap[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await StudentSavingsService.getGradeRecap(date, month, year);
    return res?.result || [];
  }, [date, month, year]);

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
    const controller = new AbortController();
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
      } catch {
        if (!cancelled) setData([]);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, fetchData]);

  return { data, loading, refresh };
}

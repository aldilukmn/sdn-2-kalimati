"use client";

import { useEffect, useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import type { GradeRecap } from "@/types/student-savings";

export function useGradeRecap(date?: string, month?: number, year?: number) {
  const [data, setData] = useState<GradeRecap[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await StudentSavingsService.getGradeRecap(date, month, year);
        if (!signal.aborted) {
          setData(res?.result || []);
        }
      } catch {
        if (!signal.aborted) setData([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [date, month, year]);

  return { data, loading };
}

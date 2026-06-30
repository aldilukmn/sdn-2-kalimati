"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface StudentAttendance {
  _id: string;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
}

export function useTeacherChart(grade: string, month: number, year: number) {
  const [data, setData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api(`/attendance/by-grade/${grade}?month=${month}&year=${year}`);
        if (!cancelled) {
          setData(res.result || res.data || []);
        }
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [grade, month, year]);

  return { data, loading };
}

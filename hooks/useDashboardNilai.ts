import { useState, useEffect, useCallback } from "react";
import AcademicDashboardService, { AcademicSummaryResponse } from "@/services/academic-dashboard.service";

// Helpers to get default semester and academic year
const getInitialSemester = () => {
  const month = new Date().getMonth() + 1; // 1-12
  return month >= 7 ? "1" : "2"; // Jul-Dec = Sem 1, Jan-Jun = Sem 2
};

const getInitialAcademicYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 7) {
    return `${year}/${year + 1}`;
  }
  return `${year - 1}/${year}`;
};

export function useDashboardNilai(userRole: string | null, userGrade: string | null) {
  const [grade, setGrade] = useState<string>(userGrade ?? "1");
  const [semester, setSemester] = useState<string>(getInitialSemester());
  const [academicYear, setAcademicYear] = useState<string>(getInitialAcademicYear());

  const [data, setData] = useState<AcademicSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  // Sync grade for guru role
  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);

  useEffect(() => {
    if (!grade || !semester || !academicYear) return;

    let cancelled = false;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AcademicDashboardService.getAcademicSummary(grade, semester, academicYear);
        if (cancelled) return;
        
        // The API returns the data wrapped in defaultResponse which usually has `data` or `result`
        // We'll extract it based on how the API returns it
        const resultData = (response as any).data || (response as any).result || response;
        setData(resultData);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Gagal mengambil data dashboard akademik");
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [grade, semester, academicYear, retryCount]);

  // Derived Data
  const topRajin = data?.students ? [...data.students].slice(0, 5) : [];
  
  // Perlu perhatian: Bottom 5 or students with completion rate < 60%
  const bottomPerhatian = data?.students 
    ? [...data.students].reverse().slice(0, 5) 
    : [];

  return {
    grade,
    setGrade,
    semester,
    setSemester,
    academicYear,
    setAcademicYear,
    data,
    loading,
    error,
    retry,
    topRajin,
    bottomPerhatian,
    hasData: data !== null && data.students.length > 0,
  };
}

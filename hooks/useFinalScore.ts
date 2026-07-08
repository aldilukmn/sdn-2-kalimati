"use client";

import { useEffect, useState, useCallback } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import FinalScoreService from "@/services/final-score.service";
import type { FinalScoreEntry, CalculateResponse } from "@/services/final-score.service";
import type { GradeSubject } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

export function useFinalScore(userRole: string | null = null, userGrade: string | null = null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [grade, setGrade] = useState("1");

  // Lock grade for guru
  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState("");

  const [entries, setEntries] = useState<FinalScoreEntry[]>([]);
  const [isStale, setIsStale] = useState(false);
  const [lastCalculatedAt, setLastCalculatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calculateResult, setCalculateResult] = useState<CalculateResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Fetch grade-subjects
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        setGradeSubjects(res?.result || []);
        setSelectedGS((res?.result || []).length > 0 ? res!.result![0]._id : "");
      } catch {
        setGradeSubjects([]);
        setSelectedGS("");
        setError("Gagal memuat data mapel.");
      } finally {
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, retryCount]);

  // Fetch final scores
  useEffect(() => {
    if (!selectedGS) { setEntries([]); return; }
    const gs = gradeSubjects.find((g) => g._id === selectedGS);
    if (!gs) return;

    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await FinalScoreService.getAll({
          grade: gs.grade,
          subjectId: gs.subjectId,
          semester,
          academicYear,
        });
        const data = res?.result || [];
        setEntries(data);
        setIsStale(data.some((e) => e.isStale));
        const dates = data.map((e) => e.calculatedAt).filter(Boolean) as string[];
        setLastCalculatedAt(dates.length > 0 ? dates.sort().reverse()[0] : null);
      } catch {
        setEntries([]);
        setError("Gagal memuat data nilai akhir.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedGS, grade, semester, academicYear, retryCount]);

  const handleCalculate = async () => {
    const gs = gradeSubjects.find((g) => g._id === selectedGS);
    if (!gs) return;
    setCalculating(true);
    try {
      const res = await FinalScoreService.calculate({
        grade: gs.grade,
        subjectId: gs.subjectId,
        semester,
        academicYear,
      });
      setCalculateResult(res?.result || null);
      setRetryCount((c) => c + 1);
      return true;
    } catch {
      return false;
    } finally {
      setCalculating(false);
    }
  };

  // Summary computation
  const totalStudents = entries.length;
  const completeStudents = entries.filter((e) => e.finalScore !== null).length;
  const incompleteStudents = entries.filter((e) => e.finalScore === null).length;

  const missingByComponent: Record<string, number> = {};
  entries.forEach((e) => {
    e.missingComponents.forEach((key) => {
      missingByComponent[key] = (missingByComponent[key] || 0) + 1;
    });
  });

  const gsId = selectedGS;
  const selectedGSData = gradeSubjects.find((gs) => gs._id === gsId);

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    gradeSubjects, selectedGS, setSelectedGS,
    entries, loading, initialLoading, error, retry,
    isStale, lastCalculatedAt,
    calculating, calculateResult, handleCalculate,
    totalStudents, completeStudents, incompleteStudents, missingByComponent,
    selectedGSData,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

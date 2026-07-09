"use client";

import { useEffect, useState, useCallback } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import FinalScoreService from "@/services/final-score.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import type { FinalScoreEntry, CalculateResponse } from "@/services/final-score.service";
import type { GradeSubject } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export function useFinalScore() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isJwtReady, setIsJwtReady] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    let role: string | null = null;
    let gradeFromToken: string | null = null;
    if (token) {
      try {
        const payload = decodeJWT(token);
        if (payload) { role = payload.role; gradeFromToken = payload.grade; }
      } catch {}
    }
    if (!role) {
      const match = document.cookie.match(/(?:^|; )user_role=([^;]*)/);
      role = match ? decodeURIComponent(match[1]) : null;
      const gradeMatch = document.cookie.match(/(?:^|; )user_grade=([^;]*)/);
      gradeFromToken = gradeMatch ? decodeURIComponent(gradeMatch[1]) : null;
    }
    if (role) setUserRole(role);
    if (role === "guru" && gradeFromToken) setGrade(gradeFromToken);
    else if (role && role !== "guru") setGrade("1");
    setIsJwtReady(true);
  }, []);
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
    if (!isJwtReady || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        const result = res?.result || [];
        setGradeSubjects(result);
        if (result.length === 0) {
          setSelectedGS("");
        } else if (selectedGS && !result.some((gs: { _id: string }) => gs._id === selectedGS)) {
          setSelectedGS("");
        }
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
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    entries, loading, initialLoading, error, retry,
    isStale, lastCalculatedAt,
    calculating, calculateResult, handleCalculate,
    totalStudents, completeStudents, incompleteStudents, missingByComponent,
    selectedGSData,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import type { AssessmentListItem } from "@/types/character-assessment";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export interface RecapRow {
  studentId: string;
  name: string;
  monthlyScores: Record<string, number | null>;
  studentAverage: number | null;
}

export function useRekapKarakter(userRole: string | null, userGrade: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState(userGrade ?? "");
  const [month, setMonth] = useState("");

  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);

  useEffect(() => {
    if (!grade) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params: { grade: string; academicYear: string; semester: string; month?: string } = {
          grade,
          academicYear,
          semester,
        };
        if (month) params.month = month;
        const res = await CharacterAssessmentService.getAll(params);
        setAssessments(res?.result || []);
      } catch {
        setAssessments([]);
        setError("Gagal memuat data rekap.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    })();
  }, [grade, semester, academicYear, month, retryCount]);

  const uniqueMonths = Array.from(
    new Map(assessments.map((a) => [a.month, a.monthOrder])).entries()
  )
    .sort((a, b) => a[1] - b[1])
    .map(([monthName]) => monthName);

  const studentIdsOrder: string[] = [];
  const studentMap = new Map<string, { name: string; scores: Map<string, number> }>();

  for (const a of assessments) {
    if (!studentMap.has(a.studentId)) {
      studentMap.set(a.studentId, { name: a.name, scores: new Map() });
      studentIdsOrder.push(a.studentId);
    }
    studentMap.get(a.studentId)!.scores.set(a.month, a.characterScore);
  }

  const monthsToShow = month ? [month] : uniqueMonths;

  const recapRows: RecapRow[] = studentIdsOrder.map((studentId) => {
    const entry = studentMap.get(studentId)!;
    const monthlyScores: Record<string, number | null> = {};
    for (const m of monthsToShow) {
      monthlyScores[m] = entry.scores.get(m) ?? null;
    }
    const scores = Object.values(monthlyScores).filter((s): s is number => s !== null);
    const studentAverage = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
      : null;
    return { studentId, name: entry.name, monthlyScores, studentAverage };
  });

  const totalStudents = recapRows.length;
  const allScores = assessments.map((a) => a.characterScore);
  const avgScore = allScores.length > 0
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
    : null;
  const highestScore = allScores.length > 0 ? Math.max(...allScores) : null;
  const lowestScore = allScores.length > 0 ? Math.min(...allScores) : null;

  const classAverages: Record<string, number | null> = {};
  for (const m of monthsToShow) {
    const scores = assessments
      .filter((a) => a.month === m)
      .map((a) => a.characterScore);
    classAverages[m] = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
      : null;
  }

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    month, setMonth,
    recapRows,
    uniqueMonths,
    classAverages,
    totalStudents,
    avgScore,
    highestScore,
    lowestScore,
    loading, initialLoading, error, retry,
    hasData: totalStudents > 0,
    monthsToShow,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

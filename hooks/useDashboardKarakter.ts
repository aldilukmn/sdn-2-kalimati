"use client";

import { useEffect, useState, useCallback } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import type { AssessmentListItem } from "@/types/character-assessment";
import { SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";

export interface RecentAssessment {
  _id: string;
  studentId: string;
  name: string;
  month: string;
  monthOrder: number;
  characterScore: number;
  updatedAt?: string;
}

export function useDashboardKarakter(userRole: string | null, userGrade: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState(userGrade ?? "");

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

    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { grade, academicYear, semester };
        const res = await CharacterAssessmentService.getAll(params);
        setAssessments(res?.result || []);
      } catch {
        setAssessments([]);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, retryCount]);

  const totalStudents = new Map(assessments.map((a) => [a.studentId, a.name])).size;
  const totalAssessments = assessments.length;
  const allScores = assessments.map((a) => a.characterScore);
  const avgScore = allScores.length > 0
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
    : null;
  const highestScore = allScores.length > 0 ? Math.max(...allScores) : null;
  const lowestScore = allScores.length > 0 ? Math.min(...allScores) : null;

  const distribution = {
    excellent: allScores.filter((s) => s >= 85).length,
    good: allScores.filter((s) => s >= 70 && s < 85).length,
    fair: allScores.filter((s) => s >= 55 && s < 70).length,
    poor: allScores.filter((s) => s < 55).length,
  };

  const recentAssessments: RecentAssessment[] = [...assessments]
    .sort((a, b) => {
      if (!a.updatedAt && !b.updatedAt) return 0;
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5);

  const hasData = totalAssessments > 0;

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    totalStudents,
    totalAssessments,
    avgScore,
    highestScore,
    lowestScore,
    distribution,
    recentAssessments,
    loading, initialLoading, error, retry,
    hasData,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

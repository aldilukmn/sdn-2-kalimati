"use client";

import { useEffect, useState, useCallback } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import { useAuth } from "@/hooks/useAuth";
import type { AssessmentListItem } from "@/types/character-assessment";
import { SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";

export interface RecapRow {
  studentId: string;
  name: string;
  monthlyScores: Record<string, number | null>;
  studentAverage: number | null;
}

export function useRekapKarakter() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");
  const [month, setMonth] = useState("");
  
  const { payload } = useAuth();
  const role = payload?.role as string | undefined;
  const authGrade = payload?.grade as string | undefined;

  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [students, setStudents] = useState<{ studentId: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (role?.toLowerCase() !== "admin" && authGrade) {
      setGrade(authGrade);
    } else if (role && role?.toLowerCase() === "admin") {
      setGrade("1");
    }
  }, [role, authGrade]);

  useEffect(() => {
    if (!grade) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params: { grade: string; academicYear: string; semester: string } = {
          grade,
          academicYear,
          semester,
        };
        const [assessmentsRes, studentsRes] = await Promise.all([
          CharacterAssessmentService.getAll(params),
          StudentAttendanceService.getStudentsByGrade(grade),
        ]);
        setAssessments(assessmentsRes?.result || []);
        
        const studentsData = (studentsRes?.result || []).map((s: { studentId?: string; nis?: string; name: string }) => ({
          studentId: s.studentId || s.nis || "",
          name: s.name,
        }));
        setStudents(studentsData);
      } catch {
        setAssessments([]);
        setStudents([]);
        setError("Gagal memuat data rekap.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    })();
  }, [grade, semester, academicYear, retryCount]);

  const uniqueMonths = semester === "1"
    ? ["Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    : ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];

  const studentIdsOrder: string[] = [];
  const studentMap = new Map<string, { name: string; scores: Map<string, number> }>();

  for (const s of students) {
    studentMap.set(s.studentId, { name: s.name, scores: new Map() });
    studentIdsOrder.push(s.studentId);
  }

  for (const a of assessments) {
    if (!studentMap.has(a.studentId)) {
      studentMap.set(a.studentId, { name: a.name, scores: new Map() });
      studentIdsOrder.push(a.studentId);
    }
    
    let monthName = String(a.month);
    const monthIndex = Number(monthName);
    if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
      monthName = MONTHS_ID[monthIndex - 1];
    }
    
    studentMap.get(a.studentId)!.scores.set(monthName, a.characterScore);
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
    const scores = recapRows
      .map((r) => r.monthlyScores[m])
      .filter((s): s is number => s !== null);
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

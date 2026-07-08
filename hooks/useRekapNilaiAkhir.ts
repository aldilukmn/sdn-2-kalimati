"use client";

import { useEffect, useState, useCallback } from "react";
import FinalScoreService from "@/services/final-score.service";
import GradeSubjectService from "@/services/grade-subject.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import type { GradeSubject } from "@/types/nilai-harian";
import type { FinalScoreEntry } from "@/services/final-score.service";
import type { MasterStudentType } from "@/types/attendance";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

export interface SubjectColumn {
  subjectId: string;
  subjectName: string;
}

export interface MatrixRow {
  studentId: string;
  studentName: string;
  scores: Record<string, number | null>;
  average: number | null;
}

export function useRekapNilaiAkhir(userRole: string | null, userGrade: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [grade, setGrade] = useState("1");

  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [entries, setEntries] = useState<FinalScoreEntry[]>([]);
  const [students, setStudents] = useState<MasterStudentType[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Lock grade for guru
  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);

  useEffect(() => {
    if (!grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const [gsRes, fScoreRes, studentsRes] = await Promise.all([
          GradeSubjectService.getAll({ grade, semester, academicYear }),
          FinalScoreService.getAll({ grade, semester, academicYear }),
          StudentAttendanceService.getStudentsByGrade(grade),
        ]);
        setGradeSubjects(gsRes?.result || []);
        setEntries(fScoreRes?.result || []);
        setStudents(studentsRes?.result || []);
      } catch {
        setGradeSubjects([]);
        setEntries([]);
        setStudents([]);
        setError("Gagal memuat data rekap.");
      } finally {
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, retryCount]);

  // Unique subjects as columns (from grade-subjects that have at least 1 entry)
  const uniqueSubjects: SubjectColumn[] = gradeSubjects
    .filter((gs) => entries.some((e) => e.subjectId === gs.subjectId))
    .filter((s, i, arr) => arr.findIndex((x) => x.subjectId === s.subjectId) === i)
    .map((gs) => ({
      subjectId: gs.subjectId,
      subjectName: gs.subjectName || "-",
    }));

  // Build matrix rows from students list
  const matrix: MatrixRow[] = students
    .filter((s) => s.studentId)
    .map((student) => {
      const scores: Record<string, number | null> = {};
      let totalScore = 0;
      let scoreCount = 0;

      uniqueSubjects.forEach((subj) => {
        const entry = entries.find(
          (e) => e.studentId === student.studentId && e.subjectId === subj.subjectId
        );
        const val = entry?.finalScore ?? null;
        scores[subj.subjectId] = val;
        if (val !== null) {
          totalScore += val;
          scoreCount++;
        }
      });

      return {
        studentId: student.studentId,
        studentName: student.name,
        scores,
        average: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : null,
      };
    });

  // Class average per subject
  const classAverages: Record<string, number | null> = {};
  uniqueSubjects.forEach((subj) => {
    const scores = matrix
      .map((row) => row.scores[subj.subjectId])
      .filter((s): s is number => s !== null);
    classAverages[subj.subjectId] =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;
  });

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    uniqueSubjects,
    matrix,
    classAverages,
    loading, initialLoading, error, retry,
    hasData: matrix.length > 0,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

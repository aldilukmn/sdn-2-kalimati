"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import CharacterHabitService from "@/services/character-habit.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import type { CharacterHabit } from "@/types/character-habit";
import toast from "react-hot-toast";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

interface StudentRow {
  studentId: string;
  name: string;
}

interface StudentScore {
  [habitId: string]: string;
}

export function useCharacterAssessment() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [month, setMonth] = useState("");
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

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [habits, setHabits] = useState<CharacterHabit[]>([]);
  const [assessments, setAssessments] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, StudentScore>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const savingRef = useRef(false);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  const resetForm = useCallback(() => {
    setStudents([]);
    setAssessments({});
    setScores({});
    setError(null);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!isJwtReady || !grade || !month) return;
    setLoading(true);
    setError(null);
    try {
      const [habitsRes, studentsRes, assessmentsRes] = await Promise.all([
        CharacterHabitService.getAll(),
        StudentAttendanceService.getStudentsByGrade(grade),
        CharacterAssessmentService.getAll({ grade, academicYear, semester, month }),
      ]);

      const habitsData = habitsRes?.result || [];
      const studentsData = (studentsRes?.result || []).map((s: { studentId?: string; nis?: string; name: string }) => ({
        studentId: s.studentId || s.nis || "",
        name: s.name,
      }));
      const assessmentsData = assessmentsRes?.result || [];

      setHabits(habitsData);
      setStudents(studentsData);

      const assessmentMap: Record<string, string> = {};
      const scoreMap: Record<string, StudentScore> = {};

      for (const a of assessmentsData) {
        if (a.studentId) {
          assessmentMap[a.studentId] = a._id;
        }
      }

      if (assessmentsData.length > 0) {
        const detailPromises = assessmentsData.map((a: { _id: string; studentId: string }) =>
          CharacterAssessmentService.getById(a._id).then((res) => ({ studentId: a.studentId, data: res?.result })).catch(() => null)
        );
        const details = await Promise.all(detailPromises);
        for (const d of details) {
          if (d?.data?.habits) {
            const habitScores: StudentScore = {};
            for (const h of d.data.habits) {
              habitScores[h.habitId] = h.value;
            }
            scoreMap[d.studentId] = habitScores;
          }
        }
      }

      setAssessments(assessmentMap);
      setScores(scoreMap);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Gagal memuat data penilaian";
      setError(message);
      resetForm();
    } finally {
      setLoading(false);
    }
  }, [isJwtReady, grade, semester, academicYear, month, resetForm]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, retryCount]);

  const handleScoreChange = (studentId: string, habitId: string, value: "A" | "B" | "C" | "D") => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [habitId]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    const studentsToSave: { studentId: string; name: string; habits: { habitId: string; value: "A" | "B" | "C" | "D" }[] }[] = [];

    for (const student of students) {
      const studentScores = scores[student.studentId];
      if (!studentScores) continue;
      const habitEntries = habits
        .filter((h) => studentScores[h._id])
        .map((h) => ({ habitId: h._id, value: studentScores[h._id] as "A" | "B" | "C" | "D" }));
      if (habitEntries.length === 0) continue;
      studentsToSave.push({
        studentId: student.studentId,
        name: student.name,
        habits: habitEntries,
      });
    }

    if (studentsToSave.length === 0) {
      toast.error("Tidak ada data untuk disimpan");
      savingRef.current = false;
      setSaving(false);
      return;
    }

    const monthOrder = MONTHS_ID.indexOf(month) + 1;

    try {
      const results = await Promise.allSettled(
        studentsToSave.map((s) => {
          const existingId = assessments[s.studentId];
          const payload = {
            habits: s.habits,
          };
          const base = {
            studentId: s.studentId,
            name: s.name,
            grade,
            academicYear,
            semester,
            month,
            monthOrder,
            habits: s.habits,
          };
          return existingId
            ? CharacterAssessmentService.update(existingId, payload)
            : CharacterAssessmentService.create(base);
        })
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      const failedMessages: string[] = [];
      for (const r of results) {
        if (r.status === "rejected") {
          const msg = r.reason instanceof Error ? r.reason.message : "Gagal menyimpan";
          if (!failedMessages.includes(msg)) failedMessages.push(msg);
        }
      }

      if (failed === 0) {
        toast.success(`${succeeded} penilaian berhasil disimpan`);
      } else if (succeeded > 0) {
        toast.error(`${succeeded} berhasil, ${failed} gagal`);
        for (const msg of failedMessages) {
          toast.error(msg, { id: msg });
        }
      } else {
        toast.error(failedMessages[0] || "Gagal menyimpan penilaian");
      }
    } catch {}

    try {
      await fetchAll();
    } catch {}

    savingRef.current = false;
    setSaving(false);
  };

  const handleEdit = async (assessmentId: string) => {
    try {
      const res = await CharacterAssessmentService.getById(assessmentId);
      const data = res?.result;
      if (data?.habits && data?.studentId) {
        const habitScores: StudentScore = {};
        for (const h of data.habits) {
          habitScores[h.habitId] = h.value;
        }
        setScores((prev) => ({
          ...prev,
          [data.studentId]: habitScores,
        }));
        toast.success("Data dimuat kembali, silakan edit");
      }
    } catch {
      toast.error("Gagal memuat data penilaian");
    }
  };

  const handleDelete = async (assessmentId: string, studentName: string) => {
    try {
      await CharacterAssessmentService.remove(assessmentId);
      toast.success(`Penilaian ${studentName} berhasil dihapus`);
      await fetchAll();
    } catch {
      toast.error("Gagal menghapus penilaian");
    }
  };

  const hasChanges = students.some((s) => {
    const studentScores = scores[s.studentId];
    if (!studentScores) return false;
    return habits.some((h) => studentScores[h._id]);
  });

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    month, setMonth,
    grade, setGrade,
    userRole,
    students, habits,
    assessments, scores,
    saving, loading, error, retry,
    hasChanges,
    handleScoreChange,
    handleSave,
    handleEdit,
    handleDelete,
    SEMESTERS, ACADEMIC_YEARS,
    MONTHS_ID, GRADES,
  };
}

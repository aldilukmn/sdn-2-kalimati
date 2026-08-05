"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import CharacterHabitService from "@/services/character-habit.service";
import { useAuth } from "@/hooks/useAuth";
import { GRADES, SEMESTERS, ACADEMIC_YEARS, ITEMS_PER_PAGE } from "@/lib/constants";
import { MONTHS_ID } from "@/lib/format";
import type { CharacterHabit } from "@/types/character-habit";
import toast from "react-hot-toast";

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
  const { payload } = useAuth();
  const role = payload?.role as string | undefined;
  const authGrade = payload?.grade as string | undefined;

  useEffect(() => {
    if (role?.toLowerCase() !== "admin" && authGrade) setGrade(authGrade);
    else if (role && role?.toLowerCase() === "admin") setGrade("1");
  }, [role, authGrade]);

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [habits, setHabits] = useState<CharacterHabit[]>([]);
  const [assessments, setAssessments] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, StudentScore>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
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
    setCurrentPage(1);
    setModifiedStudents(new Set());
    setError(null);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!role || !grade || !month) return;
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

      setAssessments(assessmentMap);
      setScores(scoreMap);
      setModifiedStudents(new Set());
      setCurrentPage(1);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Gagal memuat data penilaian";
      setError(message);
      resetForm();
    } finally {
      setLoading(false);
    }
  }, [role, grade, semester, academicYear, month, resetForm]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, retryCount]);

  // Lazy load assessment details for the current page
  useEffect(() => {
    if (students.length === 0) {
      setLoadingScores(false);
      return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const studentsToFetch = paginatedStudents.filter(
      (s) => assessments[s.studentId] && !scores[s.studentId]
    );

    if (studentsToFetch.length === 0) {
      setLoadingScores(false);
      return;
    }

    const fetchPageDetails = async () => {
      setLoadingScores(true);
      try {
        const detailPromises = studentsToFetch.map((s) =>
          CharacterAssessmentService.getById(assessments[s.studentId])
            .then((res) => ({ studentId: s.studentId, data: res?.result }))
            .catch(() => null)
        );

        const details = await Promise.all(detailPromises);
        
        setScores((prev) => {
          const newScores = { ...prev };
          for (const d of details) {
            if (d?.data?.habits) {
              const habitScores: StudentScore = {};
              for (const h of d.data.habits) {
                habitScores[h.habitId] = h.value;
              }
              newScores[d.studentId] = habitScores;
            }
          }
          return newScores;
        });
      } catch (e) {
        console.error("Failed to load page details", e);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchPageDetails();
  }, [currentPage, students, assessments, scores]);

  const handleScoreChange = (studentId: string, habitId: string, value: "A" | "B" | "C" | "D") => {
    setModifiedStudents(prev => new Set(prev).add(studentId));
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [habitId]: value,
      },
    }));
  };

  const handleSave = useCallback(async (isAutoSave?: boolean) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    const studentsToSave: { studentId: string; name: string; habits: { habitId: string; value: "A" | "B" | "C" | "D" }[] }[] = [];
    const incompleteStudents: string[] = [];

    for (const student of students) {
      if (!modifiedStudents.has(student.studentId)) continue;

      const studentScores = scores[student.studentId];
      if (!studentScores) continue;
      const habitEntries = habits
        .filter((h) => studentScores[h._id])
        .map((h) => ({ habitId: h._id, value: studentScores[h._id] as "A" | "B" | "C" | "D" }));
      
      if (habitEntries.length === 0) continue;

      if (habitEntries.length < habits.length) {
        incompleteStudents.push(student.name);
        continue;
      }

      studentsToSave.push({
        studentId: student.studentId,
        name: student.name,
        habits: habitEntries,
      });
    }

    if (studentsToSave.length === 0) {
      if (!isAutoSave) {
        if (incompleteStudents.length > 0) {
          toast.error(`Selesaikan pengisian semua (${habits.length}) kebiasaan untuk: ${incompleteStudents.join(', ')}`);
        } else {
          toast.error("Tidak ada data baru untuk disimpan");
        }
      }
      savingRef.current = false;
      setSaving(false);
      return;
    }

    const currentSavingIds = studentsToSave.map(s => s.studentId);
    setSavingIds((prev) => [...prev, ...currentSavingIds]);

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

      const succeededIds: string[] = [];
      let succeeded = 0;
      let failed = 0;
      const failedMessages: string[] = [];

      const newAssessments: Record<string, string> = {};

      results.forEach((r, idx) => {
        if (r.status === "fulfilled") {
          succeeded++;
          succeededIds.push(studentsToSave[idx].studentId);
          
          const newId = r.value?.result?._id;
          if (newId) {
            newAssessments[studentsToSave[idx].studentId] = newId;
          }
        } else {
          failed++;
          const msg = r.reason instanceof Error ? r.reason.message : "Gagal menyimpan";
          if (!failedMessages.includes(msg)) failedMessages.push(msg);
        }
      });

      if (Object.keys(newAssessments).length > 0) {
        setAssessments((prev) => ({ ...prev, ...newAssessments }));
      }

      if (failed === 0) {
        if (!isAutoSave) {
          if (incompleteStudents.length > 0) {
            toast.success(`${succeeded} siswa tersimpan. (Siswa belum lengkap: ${incompleteStudents.join(', ')})`);
          } else {
            toast.success(`${succeeded} penilaian berhasil disimpan`);
          }
        }
      } else if (succeeded > 0) {
        toast.error(`${succeeded} berhasil, ${failed} gagal`);
        for (const msg of failedMessages) {
          toast.error(msg, { id: msg });
        }
      } else {
        toast.error(failedMessages[0] || "Gagal menyimpan penilaian");
      }

      setModifiedStudents((prev) => {
        const next = new Set(prev);
        succeededIds.forEach(id => next.delete(id));
        return next;
      });
    } catch (e) {
      console.error("Gagal menyimpan penilaian:", e);
    } finally {
      savingRef.current = false;
      setSaving(false);
      setSavingIds((prev) => prev.filter(id => !currentSavingIds.includes(id)));
    }
  }, [students, modifiedStudents, scores, habits, month, grade, academicYear, semester, assessments]);

  // Auto-Save
  useEffect(() => {
    const hasPendingChanges = modifiedStudents.size > 0;
    if (!hasPendingChanges) return;
    const timer = setTimeout(() => {
      handleSave(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [modifiedStudents.size, modifiedStudents, scores, handleSave]);

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
        toast.success("Data dikembalikan ke nilai asli");
      }
    } catch {
      toast.error("Gagal memuat data penilaian");
    }
  };

  const handleDelete = async (assessmentId: string, studentName: string) => {
    const studentId = Object.keys(assessments).find((key) => assessments[key] === assessmentId);
    if (studentId) {
      setSavingIds((prev) => [...prev, studentId]);
    }

    try {
      await CharacterAssessmentService.remove(assessmentId);
      toast.success(`Penilaian ${studentName} berhasil dihapus`);
      
      if (studentId) {
        setAssessments((prev) => {
          const next = { ...prev };
          delete next[studentId];
          return next;
        });
        setScores((prev) => {
          const next = { ...prev };
          delete next[studentId];
          return next;
        });
        setModifiedStudents((prev) => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
      }
    } catch {
      toast.error("Gagal menghapus penilaian");
    } finally {
      if (studentId) {
        setSavingIds((prev) => prev.filter((id) => id !== studentId));
      }
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setLoadingScores(true);
    setCurrentPage(page);
  }, []);

  const hasChanges = modifiedStudents.size > 0;

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    month, setMonth,
    grade, setGrade,
    role,
    students, habits,
    assessments, scores,
    currentPage, setCurrentPage: handlePageChange,
    saving,
    loading,
    loadingScores,
    savingIds,
    error,
    retry,
    hasChanges,
    handleScoreChange,
    handleSave,
    handleEdit,
    handleDelete,
    SEMESTERS, ACADEMIC_YEARS,
    MONTHS_ID, GRADES,
  };
}

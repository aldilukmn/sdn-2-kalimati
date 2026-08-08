"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GRADES, SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";
import { LitnumTaskService, LitnumScoreService } from "@/services/litnum.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import type { LitnumTask, LitnumScore } from "@/types/litnum";
import type { MasterStudentType } from "@/types/attendance";
import toast from "react-hot-toast";

export function useLitnum() {
  const { role, grade: authGrade } = useAuth();

  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");

  const [tasks, setTasks] = useState<LitnumTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [scores, setScores] = useState<LitnumScore[]>([]);
  const [students, setStudents] = useState<MasterStudentType[]>([]);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});
  const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const savingRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableGrades, setAvailableGrades] = useState<string[]>(GRADES);

  useEffect(() => {
    if (role === "guru" && authGrade) {
      setGrade(authGrade);
      setAvailableGrades([authGrade]);
    } else if (role && role !== "guru") {
      setGrade(""); // Default to empty "Pilih Kelas"
    }
  }, [role, authGrade]);

  // Fetch available grades for admin based on AssessmentConfig
  useEffect(() => {
    if (!role || role === "guru" || !semester || !academicYear) return;
    const fetchConfigs = async () => {
      try {
        const { default: AssessmentConfigService } = await import("@/services/assessment-config.service");
        const res = await AssessmentConfigService.getAll({ semester, academicYear });
        if (res?.result) {
          const configs = res.result;
          const validGrades = new Set<string>();
          configs.forEach(cfg => {
            if (cfg.components.some(c => c.key.toLowerCase() === "litnum")) {
              validGrades.add(cfg.grade);
            }
          });
          const newAvailable = GRADES.filter(g => validGrades.has(g));
          setAvailableGrades(newAvailable);
          
          setGrade(prev => {
            // Only auto-reset if they HAD a grade selected and it became invalid
            if (prev && !validGrades.has(prev)) {
               return "";
            }
            return prev;
          });
        }
      } catch(e) {
        console.error("Failed to fetch assessment configs for litnum filter", e);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchConfigs();
  }, [semester, academicYear, role]);

  useEffect(() => {
    if (!role || !grade || !academicYear || !semester) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await LitnumTaskService.getAll({
          grade,
          semester,
          academicYear,
        });
        setTasks(res?.result || []);
        setSelectedTaskId(null);
        setScores([]);
        setScoreInputs({});

        const studentRes = await StudentAttendanceService.getStudentsByGrade(grade);
        setStudents(studentRes?.result || []);
      } catch {
        setError("Gagal memuat data Literasi & Numerasi.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, role]);

  useEffect(() => {
    if (!selectedTaskId) {
      setScores([]);
      setScoreInputs({});
      setModifiedStudents(new Set());
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      setScoresLoading(true);
      try {
        const res = await LitnumScoreService.getAll(selectedTaskId);
        const scoreList = res?.result || [];
        setScores(scoreList);

        const inputs: Record<string, string> = {};
        for (const s of scoreList) {
          inputs[s.studentId] = String(s.score);
        }
        setScoreInputs(inputs);
        setModifiedStudents(new Set());

        setTasks((prev) =>
          prev.map((t) =>
            t._id === selectedTaskId
              ? { ...t, inputtedCount: scoreList.length }
              : t
          )
        );
      } catch {
        toast.error("Gagal memuat nilai LitNum.");
      } finally {
        setScoresLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedTaskId]);

  const addTask = useCallback(async (name: string) => {
    if (!grade || !semester || !academicYear) return;
    try {
      const res = await LitnumTaskService.create({ grade, semester, academicYear, name });
      if (res?.result) {
        setTasks((prev) => [...prev, res.result as LitnumTask]);
        toast.success("Sub-penilaian berhasil ditambahkan");
      }
    } catch {
      toast.error("Gagal menambah sub-penilaian");
    }
  }, [grade, semester, academicYear]);

  const editTask = useCallback(async (id: string, name: string) => {
    try {
      const res = await LitnumTaskService.update(id, { name });
      if (res?.result) {
        setTasks((prev) => prev.map((t) => (t._id === id ? { ...res.result as LitnumTask, inputtedCount: t.inputtedCount } : t)));
        toast.success("Sub-penilaian berhasil diubah");
      }
    } catch {
      toast.error("Gagal mengubah sub-penilaian");
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      await LitnumTaskService.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (selectedTaskId === id) {
        setSelectedTaskId(null);
      }
      toast.success("Sub-penilaian berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus sub-penilaian");
    }
  }, [selectedTaskId]);

  const saveScores = useCallback(async (isAutoSave?: boolean | any) => {
    const autoSave = isAutoSave === true;
    if (!selectedTaskId) return;
    if (autoSave && modifiedStudents.size === 0) return;
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    const modifiedEntries = students.filter(s => modifiedStudents.has(s.studentId));
    const toDelete = modifiedEntries.filter(s => scoreInputs[s.studentId] === undefined || scoreInputs[s.studentId] === "");
    const toUpsert = modifiedEntries
      .filter(s => scoreInputs[s.studentId] !== undefined && scoreInputs[s.studentId] !== "")
      .map(s => ({ studentId: s.studentId, score: Number(scoreInputs[s.studentId]) }));

    const currentSavingIds = [...toDelete, ...toUpsert].map(s => s.studentId);
    setSavingIds((prev) => [...prev, ...currentSavingIds]);

    try {
      for (const s of toDelete) {
        const existingScore = scores.find((sc) => sc.studentId === s.studentId);
        if (existingScore) {
          await LitnumScoreService.remove(existingScore._id);
        }
      }

      if (toUpsert.length > 0) {
        await LitnumScoreService.bulkCreate({
          litnumId: selectedTaskId,
          scores: toUpsert,
        });
      }

      const res = await LitnumScoreService.getAll(selectedTaskId);
      const scoreList = res?.result || [];
      setScores(scoreList);
      const savedIds = new Set([...toDelete.map(s => s.studentId), ...toUpsert.map(s => s.studentId)]);
      setModifiedStudents((prev) => {
        const next = new Set(prev);
        savedIds.forEach((id) => next.delete(id));
        return next;
      });
      setTasks(prev => prev.map(t => t._id === selectedTaskId ? { ...t, inputtedCount: scoreList.length } : t));
      if (!autoSave) toast.success("Nilai LitNum berhasil disimpan");
    } catch {
      if (!autoSave) toast.error("Gagal menyimpan nilai LitNum");
    } finally {
      savingRef.current = false;
      setSaving(false);
      setSavingIds((prev) => prev.filter((id) => !currentSavingIds.includes(id)));
    }
  }, [selectedTaskId, students, scoreInputs, modifiedStudents.size]);

  const updateScoreInput = useCallback((studentId: string, value: string) => {
    setScoreInputs((prev) => ({ ...prev, [studentId]: value }));
    setModifiedStudents((prev) => {
      const newSet = new Set(prev);
      newSet.add(studentId);
      return newSet;
    });
  }, []);

  // Auto-Save
  useEffect(() => {
    if (modifiedStudents.size === 0) return;

    // Do not auto-save if the user is currently focused on a student they modified.
    // Wait until they blur or move to another student.
    if (activeStudentId && modifiedStudents.has(activeStudentId)) return;

    const timer = setTimeout(() => {
      saveScores(true);
    }, 1500); // Reduced to 1.5s since we already know they moved away
    return () => clearTimeout(timer);
  }, [modifiedStudents.size, modifiedStudents, saveScores, activeStudentId]);

  return {
    role,
    semester, setSemester,
    academicYear, setAcademicYear,
    SEMESTERS, ACADEMIC_YEARS,
    grade, setGrade, GRADES, availableGrades,
    tasks, selectedTaskId, setSelectedTaskId,
    scores, students, scoreInputs,
    loading, initialLoading, scoresLoading, saving, savingIds, error,
    activeStudentId, setActiveStudentId,
    addTask, editTask, removeTask,
    saveScores, updateScoreInput,
  };
}

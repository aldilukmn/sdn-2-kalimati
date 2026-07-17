"use client";

import { useEffect, useState, useCallback } from "react";
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
        setTasks((prev) => prev.map((t) => (t._id === id ? res.result as LitnumTask : t)));
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

  const saveScores = useCallback(async () => {
    if (!selectedTaskId) return;
    setSaving(true);
    const entries = students
      .filter((s) => scoreInputs[s.studentId] !== undefined && scoreInputs[s.studentId] !== "")
      .map((s) => ({
        studentId: s.studentId,
        score: Number(scoreInputs[s.studentId]),
      }));
    try {
      const res = await LitnumScoreService.bulkCreate({
        litnumId: selectedTaskId,
        scores: entries,
      });
      if (res?.result) {
        const scoreList = res.result as LitnumScore[];
        setScores(scoreList);
        const inputs: Record<string, string> = {};
        for (const s of scoreList) {
          inputs[s.studentId] = String(s.score);
        }
        setScoreInputs(inputs);
      }
      toast.success("Nilai LitNum berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan nilai LitNum");
    } finally {
      setSaving(false);
    }
  }, [selectedTaskId, students, scoreInputs]);

  const updateScoreInput = useCallback((studentId: string, value: string) => {
    setScoreInputs((prev) => ({ ...prev, [studentId]: value }));
  }, []);

  return {
    role,
    semester, setSemester,
    academicYear, setAcademicYear,
    SEMESTERS, ACADEMIC_YEARS,
    grade, setGrade, GRADES, availableGrades,
    tasks, selectedTaskId, setSelectedTaskId,
    scores, students, scoreInputs,
    loading, initialLoading, scoresLoading, saving, error,
    addTask, editTask, removeTask,
    saveScores, updateScoreInput,
  };
}

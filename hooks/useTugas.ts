"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GRADES, SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";
import GradeSubjectService from "@/services/grade-subject.service";
import TaskService from "@/services/task.service";
import TaskScoreService from "@/services/task-score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import type { Task, TaskScore } from "@/types/tugas";
import type { GradeSubject } from "@/types/nilai-harian";
import type { MasterStudentType } from "@/types/attendance";
import toast from "react-hot-toast";

export function useTugas() {
  const { role, grade: authGrade } = useAuth();

  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");

  const [subjects, setSubjects] = useState<GradeSubject[]>([]);
  const [subjectId, setSubjectId] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [scores, setScores] = useState<TaskScore[]>([]);
  const [students, setStudents] = useState<MasterStudentType[]>([]);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSubjectFirst, setSelectedSubjectFirst] = useState(false);

  useEffect(() => {
    if (role === "guru" && authGrade) setGrade(authGrade);
    else if (role && role !== "guru") setGrade("1");
  }, [role, authGrade]);

  useEffect(() => {
    if (!role || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({
          grade,
          semester,
          academicYear,
        });
        const list = res?.result || [];
        setSubjects(list);
        if (list.length === 0) {
          setSubjectId("");
        }
      } catch {
        setError("Gagal memuat mata pelajaran.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, role]);

  useEffect(() => {
    if (!subjectId) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await TaskService.getAll(subjectId);
        setTasks(res?.result || []);
        setSelectedTaskId(null);
        setScores([]);
        setScoreInputs({});

        const studentRes = await StudentAttendanceService.getStudentsByGrade(grade);
        setStudents(studentRes?.result || []);
        setSelectedSubjectFirst(true);
      } catch {
        toast.error("Gagal memuat data tugas.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [subjectId, grade]);

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
        const res = await TaskScoreService.getAll(selectedTaskId);
        const scoreList = res?.result || [];
        setScores(scoreList);

        const inputs: Record<string, string> = {};
        for (const s of scoreList) {
          inputs[s.studentId] = String(s.score);
        }
        setScoreInputs(inputs);
      } catch {
        toast.error("Gagal memuat nilai tugas.");
      } finally {
        setScoresLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedTaskId]);

  const addTask = useCallback(async (name: string) => {
    if (!subjectId) return;
    try {
      const res = await TaskService.create({ gradeSubjectId: subjectId, name });
      if (res?.result) {
        setTasks((prev) => [...prev, res.result as Task].sort((a, b) => a.order - b.order));
        toast.success("Tugas berhasil ditambahkan");
      }
    } catch {
      toast.error("Gagal menambah tugas");
    }
  }, [subjectId]);

  const editTask = useCallback(async (id: string, name: string) => {
    try {
      const res = await TaskService.update(id, { name });
      if (res?.result) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.result as Task : t)));
        toast.success("Tugas berhasil diubah");
      }
    } catch {
      toast.error("Gagal mengubah tugas");
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      await TaskService.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (selectedTaskId === id) {
        setSelectedTaskId(null);
      }
      toast.success("Tugas berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus tugas");
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
      const res = await TaskScoreService.bulkCreate({
        taskId: selectedTaskId,
        scores: entries,
      });
      if (res?.result) {
        const scoreList = res.result as TaskScore[];
        setScores(scoreList);
        const inputs: Record<string, string> = {};
        for (const s of scoreList) {
          inputs[s.studentId] = String(s.score);
        }
        setScoreInputs(inputs);
        setTasks((prev) => prev.map(t => t._id === selectedTaskId ? { ...t, inputtedCount: scoreList.length } : t));
      }
      toast.success("Nilai tugas berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan nilai tugas");
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
    grade, setGrade, GRADES,
    subjects, subjectId, setSubjectId,
    tasks, selectedTaskId, setSelectedTaskId,
    scores, students, scoreInputs,
    loading, initialLoading, scoresLoading, saving, error,
    selectedSubjectFirst,
    addTask, editTask, removeTask,
    saveScores, updateScoreInput,
  };
}

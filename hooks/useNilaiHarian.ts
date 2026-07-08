"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import ChapterService from "@/services/chapter.service";
import MaterialService from "@/services/material.service";
import ScoreService from "@/services/score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import type { GradeSubject, Chapter, Material, ScoreEntry, ChapterProgress, Score } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

export function useNilaiHarian(userRole?: string | null, userGrade?: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [grade, setGrade] = useState("1");

  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>({});
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  const ITEMS_PER_PAGE = 10;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch grade-subjects when grade changes
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      setSelectedChapter(null);
      setSelectedMaterial("");
      setEntries([]);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        setGradeSubjects(res?.result || []);
        if ((res?.result || []).length > 0) {
          setSelectedGS(res!.result![0]._id);
        } else {
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

  // Fetch chapters & compute progress when selectedGS changes
  useEffect(() => {
    if (!selectedGS) { setChapters([]); setChapterProgress({}); setSelectedChapter(null); return; }
    const ctrl = new AbortController();
    (async () => {
      setChaptersLoading(true);
      setSelectedChapter(null);
      setSelectedMaterial("");
      setEntries([]);
      try {
        const res = await ChapterService.getAll(selectedGS);
        const chs = res?.result || [];
        setChapters(chs);

        if (chs.length > 0) {
          const [studentsRes, ...scoreResults] = await Promise.all([
            StudentAttendanceService.getStudentsByGrade(grade),
            ...chs.map((ch) => ScoreService.getAll(ch._id).catch(() => ({ result: [] as Score[] }))),
          ]);
          const totalStudents = (studentsRes?.result || []).length;
          const progressMap: Record<string, ChapterProgress> = {};
          chs.forEach((ch, idx) => {
            const chapterScores = (scoreResults[idx]?.result || []) as Score[];
            const uniqueStudents = new Set(chapterScores.map((s) => s.studentId)).size;
            progressMap[ch._id] = {
              chapter: ch,
              totalStudents,
              gradedStudents: uniqueStudents,
              percentage: totalStudents > 0 ? Math.round((uniqueStudents / totalStudents) * 100) : 0,
            };
          });
          setChapterProgress(progressMap);

          const firstIncomplete = chs.find((ch) => (progressMap[ch._id]?.gradedStudents || 0) < totalStudents);
          setSelectedChapter(firstIncomplete || chs[0]);
        } else {
          setChapterProgress({});
        }
      } catch {
        setChapters([]);
        setChapterProgress({});
        setError("Gagal memuat data bab.");
      } finally {
        setChaptersLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedGS, grade, retryCount]);

  // Fetch materials when selectedChapter changes to per_material
  useEffect(() => {
    if (!selectedChapter || selectedChapter.inputMode === "per_chapter") {
      setMaterials([]);
      setSelectedMaterial("");
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await MaterialService.getAll(selectedChapter._id);
        const mats = res?.result || [];
        setMaterials(mats);
        if (mats.length > 0) setSelectedMaterial(mats[0]._id);
      } catch {
        setMaterials([]);
      }
    })();
    return () => ctrl.abort();
  }, [selectedChapter]);

  // Fetch scores when chapter or material changes
  useEffect(() => {
    if (!selectedChapter) { setEntries([]); return; }
    const ctrl = new AbortController();
    (async () => {
      setScoresLoading(true);
      setCurrentPage(1);
      try {
        const materialId = selectedChapter.inputMode === "per_material" ? selectedMaterial : undefined;
        if (selectedChapter.inputMode === "per_material" && !selectedMaterial) {
          setEntries([]);
          setScoresLoading(false);
          return;
        }
        const [studentsRes, scoresRes] = await Promise.all([
          StudentAttendanceService.getStudentsByGrade(grade),
          ScoreService.getAll(
            selectedChapter._id,
            selectedChapter.inputMode === "per_material" ? selectedMaterial : undefined
          ),
        ]);
        const students = studentsRes?.result || [];
        const scores = scoresRes?.result || [];
        const scoreMap = new Map(scores.map((s) => [s.studentId, s]));
        const merged: ScoreEntry[] = students.map((s) => {
          const existing = scoreMap.get(s.studentId);
          return {
            studentId: s.studentId,
            studentName: s.name,
            score: existing ? String(existing.score) : "",
            maxScore: existing ? String(existing.maxScore) : "100",
            status: existing ? ("saved" as const) : ("unsaved" as const),
            existingId: existing?._id,
          };
        });
        setEntries(merged);
      } catch {
        setEntries([]);
        setError("Gagal memuat data nilai.");
      } finally {
        setScoresLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedChapter, selectedMaterial, grade, retryCount]);

  const handleScoreChange = (studentId: string, value: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.studentId === studentId
          ? { ...e, score: value, status: e.status === "saved" ? "unsaved" as const : e.status }
          : e
      )
    );
  };

  const handleMaxScoreChange = (studentId: string, value: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.studentId === studentId
          ? { ...e, maxScore: value, status: e.status === "saved" ? "unsaved" as const : e.status }
          : e
      )
    );
  };

  const handleSave = async () => {
    if (!selectedChapter) return;
    setSaving(true);
    const payload = {
      chapterId: selectedChapter._id,
      materialId: selectedChapter.inputMode === "per_material" ? selectedMaterial : undefined,
      scores: entries.map((e) => ({
        studentId: e.studentId,
        score: e.score === "" ? 0 : Number(e.score),
        maxScore: e.maxScore === "" ? 100 : Number(e.maxScore),
      })),
    };
    try {
      await ScoreService.bulkCreate(payload);
      setEntries((prev) =>
        prev.map((e) => ({ ...e, status: "saved" as const }))
      );
    } catch (e: unknown) {
      setEntries((prev) =>
        prev.map((e) =>
          e.status === "unsaved" ? { ...e, status: "error" as const } : e
        )
      );
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, chapterProgress, chaptersLoading,
    selectedChapter, setSelectedChapter,
    materials, selectedMaterial, setSelectedMaterial,
    entries, paginatedEntries,
    saving, error, retry, initialLoading, scoresLoading,
    currentPage, setCurrentPage,
    totalPages, startIndex,
    ITEMS_PER_PAGE,
    handleScoreChange,
    handleMaxScoreChange,
    handleSave,
    inputRef,
    SEMESTERS,
    ACADEMIC_YEARS,
  };
}

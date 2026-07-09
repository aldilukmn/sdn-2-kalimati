"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import ChapterService from "@/services/chapter.service";
import MaterialService from "@/services/material.service";
import ScoreService from "@/services/score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES, ITEMS_PER_PAGE } from "@/lib/constants";
import type { GradeSubject, Chapter, Material, ScoreEntry, ChapterProgress, Score } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export function useNilaiHarian() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const savingRef = useRef(false);

  // Fetch grade-subjects when grade changes
  useEffect(() => {
    if (!isJwtReady || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      setSelectedChapter(null);
      setSelectedMaterial("");
      setEntries([]);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        const result = res?.result || [];
        setGradeSubjects(result);
        if (result.length === 0) {
          setSelectedGS("");
        } else if (selectedGS) {
          const currentSubjectId = gradeSubjects.find((gs) => gs._id === selectedGS)?.subjectId;
          if (currentSubjectId) {
            const newGS = result.find((gs: { subjectId: string }) => gs.subjectId === currentSubjectId);
            setSelectedGS(newGS ? newGS._id : "");
          } else {
            setSelectedGS("");
          }
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
    const gs = gradeSubjects.find((g) => g._id === selectedGS);
    if (!gs || gs.grade !== grade) return;
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
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    console.log("[SAVE]", {
      chapterId: selectedChapter._id,
      chapterName: selectedChapter.name,
      inputMode: selectedChapter.inputMode,
      materialId: selectedChapter.inputMode === "per_material" ? selectedMaterial : null,
      scoresCount: entries.filter((e) => e.score !== "").length,
      totalEntries: entries.length,
    });
    const payload = {
      chapterId: selectedChapter._id,
      materialId: selectedChapter.inputMode === "per_material" ? selectedMaterial : undefined,
      scores: entries
        .filter((e) => e.score !== "")
        .map((e) => ({
          studentId: e.studentId,
          score: Number(e.score),
          maxScore: e.maxScore === "" ? 100 : Number(e.maxScore),
        })),
    };
    try {
      await ScoreService.bulkCreate(payload);
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          status: e.score !== "" ? "saved" as const : e.status,
        }))
      );
      setChapterProgress((prev) => {
        if (!selectedChapter) return prev;
        const current = prev[selectedChapter._id];
        if (!current) return prev;
        const currentCount = entries.filter((e) => e.score !== "").length;
        const updatedGraded = Math.max(current.gradedStudents, currentCount);
        return {
          ...prev,
          [selectedChapter._id]: {
            ...current,
            gradedStudents: updatedGraded,
            percentage: current.totalStudents > 0
              ? Math.round((updatedGraded / current.totalStudents) * 100)
              : 0,
          },
        };
      });
    } catch (e: unknown) {
      setEntries((prev) =>
        prev.map((e) =>
          e.status === "unsaved" ? { ...e, status: "error" as const } : e
        )
      );
      throw e;
    } finally {
      savingRef.current = false;
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
    userRole,
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

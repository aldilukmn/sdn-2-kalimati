"use client";

import { useEffect, useState } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import ChapterService from "@/services/chapter.service";
import MaterialService from "@/services/material.service";
import ScoreService from "@/services/score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import type { GradeSubject, Chapter, Material, Score, RekapEntry, RekapMaterialDetail, ClassAverageItem } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export function useRekapNilai() {
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
  const [rekapEntries, setRekapEntries] = useState<RekapEntry[]>([]);
  const [classAverages, setClassAverages] = useState<ClassAverageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    setError(null);
    setRetryCount((c) => c + 1);
  };

  // Fetch grade-subjects
  useEffect(() => {
    if (!isJwtReady || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      setRekapEntries([]);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        setGradeSubjects(res?.result || []);
        if ((res?.result || []).length === 0) setSelectedGS("");
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

  // Fetch chapters & compute rekap
  useEffect(() => {
    if (!selectedGS) { setChapters([]); setRekapEntries([]); return; }
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      setRekapEntries([]);
      try {
        const [chaptersRes, studentsRes] = await Promise.all([
          ChapterService.getAll(selectedGS),
          StudentAttendanceService.getStudentsByGrade(grade),
        ]);
        const chs = (chaptersRes?.result || []) as Chapter[];
        const students = (studentsRes?.result || []) as { studentId: string; name: string }[];
        setChapters(chs);

        if (chs.length === 0 || students.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch materials for per_material chapters
        const materialMap = new Map<string, Material[]>();
        const perMaterialChs = chs.filter((c) => c.inputMode === "per_material");
        if (perMaterialChs.length > 0) {
          const materialResults = await Promise.all(
            perMaterialChs.map((c) => MaterialService.getAll(c._id).catch(() => ({ result: [] as Material[] })))
          );
          perMaterialChs.forEach((c, i) => {
            materialMap.set(c._id, (materialResults[i]?.result || []) as Material[]);
          });
        }

        // Fetch scores for all chapters in parallel
        const scoreResults = await Promise.all(
          chs.map((ch) => ScoreService.getAll(ch._id).catch(() => ({ result: [] as Score[] })))
        );
        const scoresByChapter = new Map<string, Score[]>();
        chs.forEach((ch, i) => {
          scoresByChapter.set(ch._id, (scoreResults[i]?.result || []) as Score[]);
        });

        // Build rekap entries
        const entries: RekapEntry[] = students.map((s) => {
          const chapterScores: Record<string, number> = {};
          const chapterMaxScores: Record<string, number> = {};
          const materialDetails: Record<string, RekapMaterialDetail[]> = {};

          chs.forEach((ch) => {
            const chapterScoresList = scoresByChapter.get(ch._id) || [];
            const studentScores = chapterScoresList.filter((sc) => sc.studentId === s.studentId);

            if (ch.inputMode === "per_chapter") {
              const sc = studentScores[0];
              chapterScores[ch._id] = sc ? sc.score : 0;
              chapterMaxScores[ch._id] = sc ? sc.maxScore : 100;
            } else {
              const materials = materialMap.get(ch._id) || [];
              const details: RekapMaterialDetail[] = materials.map((m) => {
                const mScore = studentScores.find((sc) => sc.materialId === m._id);
                return {
                  materialName: m.name,
                  score: mScore ? mScore.score : 0,
                  maxScore: mScore ? mScore.maxScore : 100,
                };
              });
              materialDetails[ch._id] = details;
              const scoredDetails = details.filter((d) => d.score > 0);
              chapterScores[ch._id] = scoredDetails.length > 0
                ? scoredDetails.reduce((sum, d) => sum + d.score, 0) / scoredDetails.length
                : 0;
              chapterMaxScores[ch._id] = details.length > 0
                ? details.reduce((sum, d) => sum + d.maxScore, 0) / details.length
                : 100;
            }
          });

          const scoredChapters = Object.values(chapterScores).filter((s) => s > 0);
          const average = scoredChapters.length > 0
            ? scoredChapters.reduce((sum, s) => sum + s, 0) / scoredChapters.length
            : 0;

          return {
            studentId: s.studentId,
            studentName: s.name,
            chapterScores,
            chapterMaxScores,
            materialDetails,
            average,
          };
        });

        setRekapEntries(entries);

        // Compute class averages
        const avgs: ClassAverageItem[] = chs.map((ch) => {
          const scoresWithValue = entries
            .map((e) => e.chapterScores[ch._id])
            .filter((s) => s > 0);
          const avg = scoresWithValue.length > 0
            ? scoresWithValue.reduce((sum, s) => sum + s, 0) / scoresWithValue.length
            : 0;
          return {
            chapterId: ch._id,
            chapterName: ch.name,
            average: avg,
            overallAverage: 0,
          };
        });
        const overallScores = entries.map((e) => e.average).filter((s) => s > 0);
        const overallAvg = overallScores.length > 0
          ? overallScores.reduce((sum, s) => sum + s, 0) / overallScores.length
          : 0;
        avgs.push({
          chapterId: "overall",
          chapterName: "Rata-rata",
          average: overallAvg,
          overallAverage: overallAvg,
        });
        setClassAverages(avgs);
      } catch {
        setChapters([]);
        setRekapEntries([]);
        setError("Gagal memuat data rekap.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedGS, grade, retryCount]);

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    userRole,
    gradeSubjects, selectedGS, setSelectedGS,
    chapters, rekapEntries, classAverages,
    loading, error, retry, initialLoading,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

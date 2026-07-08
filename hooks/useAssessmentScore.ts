"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import ChapterService from "@/services/chapter.service";
import ScoreService from "@/services/score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import AssessmentConfigService from "@/services/assessment-config.service";
import AssessmentScoreService from "@/services/assessment-score.service";
import type { GradeSubject, Chapter, Score, AssessmentConfig, AssessmentComponent } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export function useAssessmentScore(userRole?: string | null, userGrade?: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("1");

  useEffect(() => {
    if (userRole === "guru" && userGrade) {
      setGrade(userGrade);
    }
  }, [userRole, userGrade]);
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState("");

  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [students, setStudents] = useState<{ studentId: string; name: string }[]>([]);

  const [selectedComponentKey, setSelectedComponentKey] = useState("");

  const [harianScores, setHarianScores] = useState<Record<string, number>>({});
  const [harianLoading, setHarianLoading] = useState(false);

  const [nonHarianScores, setNonHarianScores] = useState<Record<string, { score: string; existingId?: string; status: "saved" | "unsaved" }>>({});
  const [nonHarianLoading, setNonHarianLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Fetch grade-subjects when filters change
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        setGradeSubjects(res?.result || []);
        setSelectedGS((res?.result || []).length > 0 ? res!.result![0]._id : "");
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

  // Fetch active config
  useEffect(() => {
    if (!grade) { setConfig(null); return; }
    const ctrl = new AbortController();
    (async () => {
      setConfigLoading(true);
      setConfigError(null);
      try {
        const res = await AssessmentConfigService.getActive({ grade, semester, academicYear });
        const cfg = res?.result || null;
        setConfig(cfg);
        const comps = cfg?.components || [];
        if (comps.length > 0) {
          const harianFirst = [...comps].sort((a) => (a.key === "harian" ? -1 : 1));
          const firstNonHarian = harianFirst.find((c) => c.key !== "harian");
          if (firstNonHarian) {
            setSelectedComponentKey(firstNonHarian.key);
          } else {
            setSelectedComponentKey(harianFirst[0].key);
          }
        }
      } catch {
        setConfig(null);
        setConfigError("Gagal memuat konfigurasi penilaian.");
      } finally {
        setConfigLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, semester, academicYear, retryCount]);

  // Fetch students
  useEffect(() => {
    if (!grade) { setStudents([]); return; }
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await StudentAttendanceService.getStudentsByGrade(grade);
        setStudents(res?.result || []);
      } catch {
        setStudents([]);
      }
    })();
    return () => ctrl.abort();
  }, [grade, retryCount]);

  // Fetch scores when component tab changes
  useEffect(() => {
    if (!selectedComponentKey || !selectedGS || !config || students.length === 0) return;

    if (selectedComponentKey === "harian") {
      fetchHarianData();
    } else {
      fetchNonHarianData();
    }
  }, [selectedComponentKey, selectedGS, config, students.length, retryCount]);

  const fetchHarianData = async () => {
    if (!selectedGS) return;
    setHarianLoading(true);
    try {
      const chaptersRes = await ChapterService.getAll(selectedGS);
      const chs = chaptersRes?.result || [];
      if (chs.length === 0) { setHarianScores({}); return; }

      const scoreResults = await Promise.all(
        chs.map((ch: Chapter) => ScoreService.getAll(ch._id).catch(() => ({ result: [] as Score[] })))
      );

      const scoresByChapter: Record<string, Score[]> = {};
      chs.forEach((ch: Chapter, i: number) => {
        scoresByChapter[ch._id] = (scoreResults[i]?.result || []) as Score[];
      });

      const computed: Record<string, number> = {};
      students.forEach((s) => {
        let totalPct = 0;
        let chapterCount = 0;
        chs.forEach((ch: Chapter) => {
          const chapterScores = scoresByChapter[ch._id].filter((sc) => sc.studentId === s.studentId);
          if (chapterScores.length > 0) {
            const chapterAvg = chapterScores.reduce((sum, sc) => sum + (sc.score / sc.maxScore), 0) / chapterScores.length;
            totalPct += chapterAvg;
            chapterCount++;
          }
        });
        computed[s.studentId] = chapterCount > 0 ? Math.round((totalPct / chapterCount) * 100 * 10) / 10 : 0;
      });
      setHarianScores(computed);
    } catch {
      setHarianScores({});
      setError("Gagal memuat nilai harian.");
    } finally {
      setHarianLoading(false);
    }
  };

  const fetchNonHarianData = async () => {
    if (!selectedGS || !selectedComponentKey) return;
    setNonHarianLoading(true);
    const gs = gradeSubjects.find((gs) => gs._id === selectedGS);
    if (!gs) { setNonHarianLoading(false); return; }

    try {
      const res = await AssessmentScoreService.getAll({
        subjectId: gs.subjectId,
        componentKey: selectedComponentKey,
        semester,
        academicYear,
      });
      const scores = res?.result || [];
      const scoreMap: Record<string, { score: string; existingId?: string; status: "saved" | "unsaved" }> = {};
      scores.forEach((s) => {
        scoreMap[s.studentId] = { score: String(s.score), existingId: s._id, status: "saved" };
      });
      setNonHarianScores(scoreMap);
    } catch {
      setNonHarianScores({});
    } finally {
      setNonHarianLoading(false);
    }
  };

  const handleScoreChange = (studentId: string, value: string) => {
    setNonHarianScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: value,
        status: prev[studentId]?.status === "saved" ? "unsaved" as const : (prev[studentId]?.status || "unsaved" as const),
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedGS || !selectedComponentKey || selectedComponentKey === "harian") return;
    const gs = gradeSubjects.find((gs) => gs._id === selectedGS);
    if (!gs) return;

    setSaving(true);
    const scoresToSave = Object.entries(nonHarianScores)
      .filter(([, v]) => v.score !== "" && Number(v.score) >= 0)
      .map(([studentId, v]) => ({
        studentId,
        score: Number(v.score),
      }));

    if (scoresToSave.length === 0) {
      setSaving(false);
      return;
    }

    try {
      await AssessmentScoreService.bulkCreate({
        subjectId: gs.subjectId,
        componentKey: selectedComponentKey,
        semester,
        academicYear,
        scores: scoresToSave,
      });
      setNonHarianScores((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((sid) => {
          updated[sid] = { ...updated[sid], status: "saved" as const };
        });
        return updated;
      });
      return true;
    } catch {
      setNonHarianScores((prev) => {
        const updated = { ...prev };
        Object.entries(updated).forEach(([sid, v]) => {
          if (v.status === "unsaved") {
            updated[sid] = { ...v, status: "unsaved" as const };
          }
        });
        return updated;
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const components = config?.components || [];
  const nonHarianComponents = components.filter((c) => c.key !== "harian");

  const gsId = selectedGS;
  const selectedGSData = gradeSubjects.find((gs) => gs._id === gsId);
  const subjectId = selectedGSData?.subjectId || "";

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    students,
    harianScores, harianLoading,
    nonHarianScores, nonHarianLoading,
    saving, error, retry, initialLoading,
    handleScoreChange, handleSave,
    subjectId,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

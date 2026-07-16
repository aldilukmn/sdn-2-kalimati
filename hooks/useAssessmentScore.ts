"use client";

import { useEffect, useState, useCallback } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import ChapterService from "@/services/chapter.service";
import ScoreService from "@/services/score.service";
import StudentAttendanceService from "@/services/student-attendance.service";
import AssessmentConfigService from "@/services/assessment-config.service";
import AssessmentScoreService from "@/services/assessment-score.service";
import CharacterAssessmentService from "@/services/character-assessment.service";
import TaskService from "@/services/task.service";
import TaskScoreService from "@/services/task-score.service";
import { useAuth } from "@/hooks/useAuth";
import { GRADES, SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";
import type { GradeSubject, Chapter, Score, AssessmentConfig, AssessmentComponent } from "@/types/nilai-harian";

export interface KarakterStudent {
  studentId: string;
  name: string;
  avg: number | null;
}

export function useAssessmentScore() {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");
  const { role, grade: authGrade } = useAuth();

  useEffect(() => {
    if (role === "guru" && authGrade) setGrade(authGrade);
    else if (role && role !== "guru") setGrade("1");
  }, [role, authGrade]);

  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState("");

  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [students, setStudents] = useState<{ studentId: string; name: string }[]>([]);

  const [selectedComponentKey, setSelectedComponentKey] = useState("");

  const [harianScores, setHarianScores] = useState<Record<string, number>>({});
  const [harianLoading, setHarianLoading] = useState(false);

  const [tugasScores, setTugasScores] = useState<Record<string, number>>({});
  const [tugasLoading, setTugasLoading] = useState(false);

  // Karakter: computed from character_assessment (NOT from assessment_scores)
  const [karakterStudents, setKarakterStudents] = useState<KarakterStudent[]>([]);
  const [karakterLoading, setKarakterLoading] = useState(false);

  // Presensi: computed from student_attendance (monthly hadir/sakit/izin/absen → formula)
  const [presensiStudents, setPresensiStudents] = useState<KarakterStudent[]>([]);
  const [presensiLoading, setPresensiLoading] = useState(false);

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
    if (!role || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        const result = res?.result || [];
        setGradeSubjects(result);
        if (result.length === 0) {
          setSelectedGS("");
        } else if (selectedGS) {
          const newSameSubject = result.find((gs: { subjectId: string }) => gs.subjectId === gradeSubjects.find((g) => g._id === selectedGS)?.subjectId);
          setSelectedGS(newSameSubject ? newSameSubject._id : "");
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
  }, [role, grade, semester, academicYear, retryCount]);

  // Fetch active config
  useEffect(() => {
    if (!role || !grade) { setConfig(null); return; }
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
  }, [role, grade, semester, academicYear, retryCount]);

  // Fetch students
  useEffect(() => {
    if (!role || !grade) { setStudents([]); return; }
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

  const safeKey = (key: string) => key?.trim().toLowerCase() || "";

  // Fetch harian / non-harian scores when tab or subject changes
  // NOTE: karakter is handled by its own separate useEffect below
  useEffect(() => {
    if (!selectedComponentKey || !selectedGS || !config || students.length === 0) return;
    if (safeKey(selectedComponentKey) === "karakter" || safeKey(selectedComponentKey) === "presensi") return; // handled separately

    if (safeKey(selectedComponentKey) === "harian") {
      fetchHarianData();
    } else if (safeKey(selectedComponentKey) === "tugas") {
      fetchTugasData();
    } else {
      fetchNonHarianData();
    }
  }, [selectedComponentKey, selectedGS, config, students.length, retryCount]);

  // ─── Karakter: fetch from character_assessment, merge with students list ───
  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "karakter") return;
    if (!role || !grade || !semester || !academicYear) return;
    if (students.length === 0) return;

    let cancelled = false;
    setKarakterLoading(true);
    setKarakterStudents([]);

    CharacterAssessmentService.getAll({ grade, academicYear, semester })
      .then((res) => {
        if (cancelled) return;
        const assessments = (res?.result || []) as {
          studentId: string;
          name: string;
          characterScore: number;
        }[];

        const scoreMap = new Map<string, number[]>();
        for (const a of assessments) {
          if (!scoreMap.has(a.studentId)) scoreMap.set(a.studentId, []);
          scoreMap.get(a.studentId)!.push(a.characterScore);
        }

        const merged: KarakterStudent[] = students.map((s) => {
          const scores = scoreMap.get(s.studentId);
          const avg = scores && scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
            : null;
          return { studentId: s.studentId, name: s.name, avg };
        });
        merged.sort((a, b) => a.name.localeCompare(b.name, "id"));
        setKarakterStudents(merged);
      })
      .catch(() => {
        if (!cancelled) setKarakterStudents([]);
      })
      .finally(() => {
        if (!cancelled) setKarakterLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedComponentKey, role, grade, semester, academicYear, retryCount, students]);

  // ─── Presensi: fetch attendance reports for all semester months, compute formula ───
  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "presensi") return;
    if (!role || !grade || !semester || !academicYear) return;
    if (students.length === 0) return;

    let cancelled = false;
    setPresensiLoading(true);
    setPresensiStudents([]);

    const months = semester === "1" ? [7, 8, 9, 10, 11, 12] : [1, 2, 3, 4, 5, 6];
    const year = parseInt(academicYear.split("/")[0], 10);

    (async () => {
      try {
        const reports = await Promise.all(
          months.map((m) =>
            StudentAttendanceService.getReportByGrade(grade, m, year)
              .then((res) => ({ month: m, data: res?.result || [] }))
              .catch(() => ({ month: m, data: [] as import("@/types/attendance").AttendanceReportItem[] }))
          )
        );

        if (cancelled) return;

        // Group by student: studentId -> month -> { hadir, sakit, izin, absen }
        const studentMonthly = new Map<string, Map<number, { hadir: number; sakit: number; izin: number; absen: number }>>();
        for (const report of reports) {
          for (const row of report.data) {
            if (!studentMonthly.has(row.studentId)) {
              studentMonthly.set(row.studentId, new Map());
            }
            studentMonthly.get(row.studentId)!.set(report.month, {
              hadir: row.hadir ?? 0,
              sakit: row.sakit ?? 0,
              izin: row.izin ?? 0,
              absen: row.absen ?? 0,
            });
          }
        }

        const merged: KarakterStudent[] = students.map((s) => {
          const monthlyData = studentMonthly.get(s.studentId);
          if (!monthlyData || monthlyData.size === 0) {
            return { studentId: s.studentId, name: s.name, avg: null };
          }

          let totalScore = 0;
          let monthCount = 0;

          for (const m of months) {
            const data = monthlyData.get(m);
            if (!data) continue;

            const totalDays = data.hadir + data.sakit + data.izin + data.absen;
            if (totalDays === 0) continue;

            const monthlyScore = ((data.hadir + 0.5 * data.sakit + 0.5 * data.izin) / totalDays) * 100;
            totalScore += monthlyScore;
            monthCount++;
          }

          const avg = monthCount > 0 ? Math.round((totalScore / monthCount) * 100) / 100 : null;
          return { studentId: s.studentId, name: s.name, avg };
        });

        merged.sort((a, b) => a.name.localeCompare(b.name, "id"));
        if (!cancelled) setPresensiStudents(merged);
      } catch {
        if (!cancelled) setPresensiStudents([]);
      } finally {
        if (!cancelled) setPresensiLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedComponentKey, role, grade, semester, academicYear, retryCount, students]);

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
        if (chapterCount > 0) computed[s.studentId] = Math.round((totalPct / chapterCount) * 100 * 100) / 100;
      });
      setHarianScores(computed);
    } catch {
      setHarianScores({});
      setError("Gagal memuat nilai harian.");
    } finally {
      setHarianLoading(false);
    }
  };

  const fetchTugasData = async () => {
    if (!selectedGS) return;
    setTugasLoading(true);
    try {
      const tasksRes = await TaskService.getAll(selectedGS);
      const tasks = tasksRes?.result || [];
      if (tasks.length === 0) { setTugasScores({}); return; }

      const scoreResults = await Promise.all(
        tasks.map((t: any) => TaskScoreService.getAll(t._id).catch(() => ({ result: [] as any[] })))
      );

      const scoresByTask: Record<string, any[]> = {};
      tasks.forEach((t: any, i: number) => {
        scoresByTask[t._id] = (scoreResults[i]?.result || []) as any[];
      });

      const computed: Record<string, number> = {};
      students.forEach((s) => {
        let totalScore = 0;
        let taskCount = 0;
        tasks.forEach((t: any) => {
          const taskScore = scoresByTask[t._id].find((sc) => sc.studentId === s.studentId);
          if (taskScore) {
            totalScore += taskScore.score;
            taskCount++;
          }
        });
        if (taskCount > 0) computed[s.studentId] = Math.round((totalScore / taskCount) * 100) / 100;
      });
      setTugasScores(computed);
    } catch {
      setTugasScores({});
      setError("Gagal memuat nilai tugas.");
    } finally {
      setTugasLoading(false);
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
    const sKey = safeKey(selectedComponentKey);
    if (!selectedGS || !selectedComponentKey || sKey === "harian" || sKey === "karakter" || sKey === "presensi" || sKey === "tugas") return;
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
  const nonHarianComponents = components.filter((c) => {
    const k = safeKey(c.key);
    return k !== "harian" && k !== "presensi" && k !== "tugas" && k !== "karakter";
  });

  const gsId = selectedGS;
  const selectedGSData = gradeSubjects.find((gs) => gs._id === gsId);
  const subjectId = selectedGSData?.subjectId || "";

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    role,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    students,
    harianScores, harianLoading,
    tugasScores, tugasLoading,
    karakterStudents, karakterLoading,
    presensiStudents, presensiLoading,
    nonHarianScores, nonHarianLoading,
    saving, error, retry, initialLoading,
    handleScoreChange, handleSave,
    subjectId,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

import { useEffect, useState } from "react";
import AssessmentScoreService from "@/services/assessment-score.service";
import type { GradeSubject } from "@/types/nilai-harian";

export function useNonHarianData(
  selectedComponentKey: string,
  selectedGS: string,
  gradeSubjects: GradeSubject[],
  semester: string,
  academicYear: string,
  retryCount: number,
  safeKey: (key: string) => string
) {
  const [nonHarianScores, setNonHarianScores] = useState<Record<string, { score: string; existingId?: string; status: "saved" | "unsaved" }>>({});
  const [nonHarianLoading, setNonHarianLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedGS || !selectedComponentKey) return;
    
    const sKey = safeKey(selectedComponentKey);
    if (sKey === "harian" || sKey === "tugas" || sKey === "karakter" || sKey === "presensi") return;

    const gs = gradeSubjects.find((gs) => gs._id === selectedGS);
    if (!gs) { 
      setNonHarianLoading(false); 
      return; 
    }

    let cancelled = false;
    setNonHarianLoading(true);

    const fetchNonHarianData = async () => {
      try {
        const res = await AssessmentScoreService.getAll({
          subjectId: gs.subjectId,
          componentKey: selectedComponentKey,
          semester,
          academicYear,
        });
        
        if (cancelled) return;
        
        const scores = res?.result || [];
        const scoreMap: Record<string, { score: string; existingId?: string; status: "saved" | "unsaved" }> = {};
        scores.forEach((s) => {
          scoreMap[s.studentId] = { score: String(s.score), existingId: s._id, status: "saved" };
        });
        setNonHarianScores(scoreMap);
      } catch {
        if (!cancelled) setNonHarianScores({});
      } finally {
        if (!cancelled) setNonHarianLoading(false);
      }
    };

    fetchNonHarianData();

    return () => { cancelled = true; };
  }, [selectedComponentKey, selectedGS, gradeSubjects, semester, academicYear, retryCount, safeKey]);

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
    if (!selectedGS || !selectedComponentKey || sKey === "harian" || sKey === "karakter" || sKey === "presensi" || sKey === "tugas") return false;
    
    const gs = gradeSubjects.find((gs) => gs._id === selectedGS);
    if (!gs) return false;

    setSaving(true);
    const scoresToSave = Object.entries(nonHarianScores)
      .filter(([, v]) => v.score !== "" && Number(v.score) >= 0)
      .map(([studentId, v]) => ({
        studentId,
        score: Number(v.score),
      }));

    if (scoresToSave.length === 0) {
      setSaving(false);
      return false;
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

  return { nonHarianScores, nonHarianLoading, saving, handleScoreChange, handleSave };
}

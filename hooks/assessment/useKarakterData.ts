import { useEffect, useState } from "react";
import CharacterAssessmentService from "@/services/character-assessment.service";

export interface KarakterStudent {
  studentId: string;
  name: string;
  avg: number | null;
}

export function useKarakterData(
  selectedComponentKey: string,
  role: string | null,
  grade: string,
  semester: string,
  academicYear: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  safeKey: (key: string) => string
) {
  const [karakterStudents, setKarakterStudents] = useState<KarakterStudent[]>([]);
  const [karakterLoading, setKarakterLoading] = useState(false);

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
  }, [selectedComponentKey, role, grade, semester, academicYear, retryCount, students, safeKey]);

  return { karakterStudents, karakterLoading };
}

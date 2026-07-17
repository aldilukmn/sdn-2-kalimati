import { useEffect, useState } from "react";
import { LitnumTaskService, LitnumScoreService } from "@/services/litnum.service";
import type { KarakterStudent } from "./useKarakterData";

export function useLitnumData(
  selectedComponentKey: string,
  role: string | null,
  grade: string,
  semester: string,
  academicYear: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  safeKey: (key: string) => string
) {
  const [litnumStudents, setLitnumStudents] = useState<KarakterStudent[]>([]);
  const [litnumLoading, setLitnumLoading] = useState(false);

  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "litnum") return;
    if (!role || !grade || !semester || !academicYear) return;
    if (students.length === 0) return;

    let cancelled = false;
    setLitnumLoading(true);
    setLitnumStudents([]);

    (async () => {
      try {
        const tasksRes = await LitnumTaskService.getAll({ grade, semester, academicYear });
        if (cancelled) return;
        
        const tasks = tasksRes?.result || [];
        
        const scoreRes = await Promise.all(
          tasks.map(t => LitnumScoreService.getAll(t._id))
        );
        
        if (cancelled) return;

        const scoreMap = new Map<string, number[]>();
        for (const res of scoreRes) {
          const scores = res?.result || [];
          for (const s of scores) {
            if (s.score !== null) {
              if (!scoreMap.has(s.studentId)) scoreMap.set(s.studentId, []);
              scoreMap.get(s.studentId)!.push(s.score);
            }
          }
        }

        const merged: KarakterStudent[] = students.map((s) => {
          const scores = scoreMap.get(s.studentId);
          const avg = scores && scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
            : null;
          return { studentId: s.studentId, name: s.name, avg };
        });
        
        merged.sort((a, b) => a.name.localeCompare(b.name, "id"));
        if (!cancelled) setLitnumStudents(merged);
      } catch (err) {
        if (!cancelled) setLitnumStudents([]);
      } finally {
        if (!cancelled) setLitnumLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedComponentKey, role, grade, semester, academicYear, retryCount, students, safeKey]);

  return { litnumStudents, litnumLoading };
}

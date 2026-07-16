import { useEffect, useState } from "react";
import TaskService from "@/services/task.service";
import TaskScoreService from "@/services/task-score.service";

export function useTugasData(
  selectedComponentKey: string,
  selectedGS: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  setError: (msg: string | null) => void,
  safeKey: (key: string) => string
) {
  const [tugasScores, setTugasScores] = useState<Record<string, number>>({});
  const [tugasLoading, setTugasLoading] = useState(false);

  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "tugas") return;
    if (!selectedGS || students.length === 0) return;

    let cancelled = false;

    const fetchTugasData = async () => {
      setTugasLoading(true);
      try {
        const tasksRes = await TaskService.getAll(selectedGS);
        const tasks = tasksRes?.result || [];
        if (tasks.length === 0) { 
          if (!cancelled) setTugasScores({}); 
          return; 
        }

        const scoreResults = await Promise.all(
          tasks.map((t: any) => TaskScoreService.getAll(t._id).catch(() => ({ result: [] as any[] })))
        );

        if (cancelled) return;

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

        if (!cancelled) setTugasScores(computed);
      } catch {
        if (!cancelled) {
          setTugasScores({});
          setError("Gagal memuat nilai tugas.");
        }
      } finally {
        if (!cancelled) setTugasLoading(false);
      }
    };

    fetchTugasData();

    return () => { cancelled = true; };
  }, [selectedComponentKey, selectedGS, students, retryCount, setError, safeKey]);

  return { tugasScores, tugasLoading };
}

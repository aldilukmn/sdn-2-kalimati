import { useEffect, useState } from "react";
import TaskService from "@/services/task.service";
import TaskScoreService from "@/services/task-score.service";

export function useKeaktifanData(
  selectedComponentKey: string,
  selectedGS: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  setError: (msg: string | null) => void,
  safeKey: (key: string) => string
) {
  const [keaktifanScores, setKeaktifanScores] = useState<Record<string, number>>({});
  const [keaktifanLoading, setKeaktifanLoading] = useState(false);

  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "keaktifan") return;
    if (!selectedGS || students.length === 0) return;

    let cancelled = false;

    const fetchKeaktifanData = async () => {
      setKeaktifanLoading(true);
      try {
        const tasksRes = await TaskService.getAll(selectedGS, "keaktifan");
        const tasks = tasksRes?.result || [];
        if (tasks.length === 0) { 
          if (!cancelled) setKeaktifanScores({}); 
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

        if (!cancelled) setKeaktifanScores(computed);
      } catch {
        if (!cancelled) {
          setKeaktifanScores({});
          setError("Gagal memuat nilai keaktifan.");
        }
      } finally {
        if (!cancelled) setKeaktifanLoading(false);
      }
    };

    fetchKeaktifanData();

    return () => { cancelled = true; };
  }, [selectedComponentKey, selectedGS, students, retryCount, setError, safeKey]);

  return { keaktifanScores, keaktifanLoading };
}

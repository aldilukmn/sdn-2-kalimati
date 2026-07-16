import { useEffect, useState } from "react";
import ChapterService from "@/services/chapter.service";
import ScoreService from "@/services/score.service";
import type { Chapter, Score } from "@/types/nilai-harian";

export function useHarianData(
  selectedComponentKey: string,
  selectedGS: string,
  students: { studentId: string; name: string }[],
  retryCount: number,
  setError: (msg: string | null) => void,
  safeKey: (key: string) => string
) {
  const [harianScores, setHarianScores] = useState<Record<string, number>>({});
  const [harianLoading, setHarianLoading] = useState(false);

  useEffect(() => {
    if (safeKey(selectedComponentKey) !== "harian") return;
    if (!selectedGS || students.length === 0) return;

    let cancelled = false;
    
    const fetchHarianData = async () => {
      setHarianLoading(true);
      try {
        const chaptersRes = await ChapterService.getAll(selectedGS);
        const chs = chaptersRes?.result || [];
        if (chs.length === 0) { 
          if (!cancelled) setHarianScores({}); 
          return; 
        }

        const scoreResults = await Promise.all(
          chs.map((ch: Chapter) => ScoreService.getAll(ch._id).catch(() => ({ result: [] as Score[] })))
        );

        if (cancelled) return;

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
        
        if (!cancelled) setHarianScores(computed);
      } catch {
        if (!cancelled) {
          setHarianScores({});
          setError("Gagal memuat nilai harian.");
        }
      } finally {
        if (!cancelled) setHarianLoading(false);
      }
    };

    fetchHarianData();

    return () => { cancelled = true; };
  }, [selectedComponentKey, selectedGS, students, retryCount, setError, safeKey]);

  return { harianScores, harianLoading };
}

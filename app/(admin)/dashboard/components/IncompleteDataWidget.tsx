"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import StudentAttendanceService from "@/services/student-attendance.service";
import GradeSubjectService from "@/services/grade-subject.service";
import TaskService from "@/services/task.service";
import TaskScoreService from "@/services/task-score.service";
import ChapterService from "@/services/chapter.service";
import ScoreService from "@/services/score.service";
import { LitnumTaskService, LitnumScoreService } from "@/services/litnum.service";
import CharacterAssessmentService from "@/services/character-assessment.service";
import type { GradeSubject, Chapter, Score } from "@/types/nilai-harian";
import type { Task } from "@/types/tugas";
import type { LitnumTask, LitnumScore } from "@/types/litnum";
import type { AssessmentListItem } from "@/types/character-assessment";

interface IncompleteDataWidgetProps {
  userGrade: string | null;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  status: "complete" | "partial" | "missing";
  detailLines: string[];
  href: string;
  icon: typeof AlertCircle;
}

function extractArray<T>(res: any): T[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.result)) return res.result;
  if (res.data && Array.isArray(res.data.result)) return res.data.result;
  return [];
}

function formatCategoryLabel(cat?: string): string {
  if (!cat) return "Nilai Tugas";
  const lower = cat.toLowerCase();
  if (lower === "tugas") return "Nilai Tugas";
  if (lower === "keaktifan") return "Nilai Keaktifan";
  if (lower === "partisipasi") return "Nilai Partisipasi";
  if (lower === "harian") return "Nilai Bab";
  return `Nilai ${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}`;
}

function formatDayDate(dateObj: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayName = days[dateObj.getDay()];
  const dd = dateObj.getDate();
  const monthName = months[dateObj.getMonth()];
  const yyyy = dateObj.getFullYear();
  return `${dayName}, ${dd} ${monthName} ${yyyy}`;
}

export default function IncompleteDataWidget({ userGrade }: IncompleteDataWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([]);

  const fetchChecklist = async () => {
    if (!userGrade) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const formattedDisplayDate = formatDayDate(now);

      // Step 1: Initial parallel batch fetch
      const [todayAttendanceRes, studentsRes, gradeSubjectsRes, litnumTasksRes, characterRes] = await Promise.all([
        StudentAttendanceService.getByGradeAndDate(userGrade, todayStr).catch(() => null),
        StudentAttendanceService.getStudentsByGrade(userGrade).catch(() => null),
        GradeSubjectService.getAll({ grade: userGrade }).catch(() => null),
        LitnumTaskService.getAll({ grade: userGrade, semester: "1", academicYear: "2026/2027" }).catch(() => null),
        CharacterAssessmentService.getAll({ grade: userGrade, semester: "1", academicYear: "2026/2027" }).catch(() => null),
      ]);

      const todayAttendance = extractArray(todayAttendanceRes);
      const students = extractArray(studentsRes);
      const rawSubjects: GradeSubject[] = extractArray(gradeSubjectsRes);
      const litnumTasks: LitnumTask[] = extractArray(litnumTasksRes);
      const characterRecords: AssessmentListItem[] = extractArray(characterRes);

      const totalStudents = students.length;
      const recordedCount = todayAttendance.length;

      let presensiStatus: "complete" | "partial" | "missing" = "missing";
      let presensiLine = `Presensi hari ini (${formattedDisplayDate}) belum diinput.`;

      if (recordedCount > 0 && totalStudents > 0) {
        if (recordedCount >= totalStudents) {
          presensiStatus = "complete";
          presensiLine = `Presensi hari ini (${formattedDisplayDate}) sudah 100% lengkap - (${recordedCount}/${totalStudents} murid).`;
        } else {
          presensiStatus = "partial";
          presensiLine = `Presensi hari ini (${formattedDisplayDate}) baru terisi sebagian - (${recordedCount}/${totalStudents} murid).`;
        }
      } else if (totalStudents === 0) {
        presensiStatus = "complete";
        presensiLine = `Belum ada murid terdaftar di Kelas ${userGrade}.`;
      }

      const checkList: ChecklistItem[] = [
        {
          id: "presensi",
          title: "Presensi Harian Kelas",
          category: "Absensi Murid",
          status: presensiStatus,
          detailLines: [presensiLine],
          href: "/presensi-murid",
          icon: CalendarCheck,
        },
      ];

      // Step 2: Fetch all tasks & chapters across subjects in PARALLEL
      if (rawSubjects.length > 0) {
        const [taskResults, chapterResults] = await Promise.all([
          Promise.all(rawSubjects.map((s) => TaskService.getAll(s._id, "all").catch(() => null))),
          Promise.all(rawSubjects.map((s) => ChapterService.getAll(s._id).catch(() => null))),
        ]);

        const chaptersWithSubject: { chapter: Chapter; subjectId: string; subjectName: string }[] = [];

        rawSubjects.forEach((subj, idx) => {
          const chapters: Chapter[] = extractArray(chapterResults[idx]);
          chapters.forEach((c) => {
            chaptersWithSubject.push({ chapter: c, subjectId: subj._id, subjectName: subj.subjectName || "Mata Pelajaran" });
          });
        });

        const chapterScoreResults = await Promise.all(
          chaptersWithSubject.map((item) => ScoreService.getAll(item.chapter._id).catch(() => null))
        );

        const chapterScoreMap = new Map<
          string,
          { totalScores: number; incompleteDetails: string[]; firstChapterId?: string; chapterCount: number }
        >();

        chaptersWithSubject.forEach((item, idx) => {
          const scores: Score[] = extractArray(chapterScoreResults[idx]);
          const existing = chapterScoreMap.get(item.subjectId) || {
            totalScores: 0,
            incompleteDetails: [],
            chapterCount: 0,
          };
          existing.totalScores += scores.length;
          existing.chapterCount += 1;

          if (totalStudents > 0 && scores.length < totalStudents) {
            if (!existing.firstChapterId) {
              existing.firstChapterId = item.chapter._id;
            }
            existing.incompleteDetails.push(`Bab "${item.chapter.name}" - (${scores.length}/${totalStudents} nilai)`);
          }
          chapterScoreMap.set(item.subjectId, existing);
        });

        // Evaluate subjects
        rawSubjects.forEach((subj, idx) => {
          const name = subj.subjectName || "Mata Pelajaran";
          const taskList: Task[] = extractArray(taskResults[idx]);
          const chapterInfo = chapterScoreMap.get(subj._id);
          const chapterCount = chapterInfo?.chapterCount || 0;

          // SKIP subject if 0 tasks & 0 chapters exist
          if (taskList.length === 0 && chapterCount === 0) return;

          let isBeingGradedIncomplete = false;
          let totalScoresFilled = chapterInfo?.totalScores || 0;
          let expectedMaxScores = chapterCount * totalStudents;
          let itemDetails: string[] = chapterInfo ? [...chapterInfo.incompleteDetails] : [];
          let firstIncompleteHref = chapterInfo?.firstChapterId
            ? `/nilai-harian?subjectId=${subj._id}&chapterId=${chapterInfo.firstChapterId}`
            : "";

          if (taskList.length > 0) {
            taskList.forEach((t) => {
              const filled = t.inputtedCount ?? 0;
              totalScoresFilled += filled;
              expectedMaxScores += totalStudents;

              if (totalStudents > 0 && filled < totalStudents) {
                isBeingGradedIncomplete = true;
                const catLabel = formatCategoryLabel(t.category);
                itemDetails.push(`${catLabel}: "${t.name}" - (${filled}/${totalStudents} nilai)`);

                if (!firstIncompleteHref) {
                  firstIncompleteHref = `/penilaian?subjectId=${subj._id}&category=${t.category || "tugas"}&taskId=${t._id}`;
                }
              }
            });
          }

          if (chapterInfo && chapterInfo.incompleteDetails.length > 0) {
            isBeingGradedIncomplete = true;
          }

          if (isBeingGradedIncomplete || (expectedMaxScores > 0 && totalScoresFilled < expectedMaxScores)) {
            const fallbackHref =
              chapterCount > 0
                ? `/nilai-harian?subjectId=${subj._id}`
                : `/penilaian?subjectId=${subj._id}&category=tugas`;

            const targetHref = firstIncompleteHref || fallbackHref;

            const lines = itemDetails.length > 0
              ? itemDetails
              : [`${totalScoresFilled} dari ${expectedMaxScores} total nilai terisi`];

            checkList.push({
              id: `subj-${subj._id}`,
              title: `${name}`,
              category: "Nilai Akademik",
              status: "partial",
              detailLines: lines,
              href: targetHref,
              icon: FileSpreadsheet,
            });
          }
        });
      }

      // Step 3: Litnum scores
      if (litnumTasks.length > 0) {
        const litnumScoreResults = await Promise.all(
          litnumTasks.map((t) => LitnumScoreService.getAll(t._id).catch(() => null))
        );

        let totalLitnumScores = 0;
        let isLitnumIncomplete = false;
        let incompleteLitnumDetails: string[] = [];

        litnumTasks.forEach((t, idx) => {
          const lScores: LitnumScore[] = extractArray(litnumScoreResults[idx]);
          totalLitnumScores += lScores.length;

          if (totalStudents > 0 && lScores.length < totalStudents) {
            isLitnumIncomplete = true;
            incompleteLitnumDetails.push(`Tugas "${t.name}" - (${lScores.length}/${totalStudents} nilai)`);
          }
        });

        const expectedLitnumMax = totalStudents * litnumTasks.length;

        if (isLitnumIncomplete || (expectedLitnumMax > 0 && totalLitnumScores < expectedLitnumMax)) {
          const lines = incompleteLitnumDetails.length > 0
            ? incompleteLitnumDetails
            : [`${totalLitnumScores} dari ${expectedLitnumMax} total nilai terisi`];

          checkList.push({
            id: "litnum",
            title: "Literasi & Numerasi",
            category: "Litnum",
            status: "partial",
            detailLines: lines,
            href: "/nilai-litnum",
            icon: BookOpen,
          });
        }
      }

      // Step 4: Character Assessment
      if (characterRecords.length > 0) {
        if (totalStudents > 0 && characterRecords.length < totalStudents) {
          checkList.push({
            id: "karakter",
            title: "Penilaian Karakter & Habits",
            category: "Karakter",
            status: "partial",
            detailLines: [`Penilaian karakter baru terisi - (${characterRecords.length}/${totalStudents} murid).`],
            href: "/penilaian-karakter",
            icon: HeartHandshake,
          });
        }
      }

      setItems(checkList);
    } catch (err) {
      console.error("Error loading checklist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [userGrade]);

  const incompleteCount = items.filter((i) => i.status !== "complete").length;

  return (
    <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Pusat Kelengkapan Data
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Menampilkan data presensi, nilai akademik, dan litnum yang sedang dinilai namun belum selesai
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={fetchChecklist}
            disabled={loading}
            className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh Status
          </button>

          {incompleteCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 whitespace-nowrap">
              {incompleteCount} Perlu Perhatian
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-24 rounded-xl bg-slate-100 dark:bg-gray-700/40 animate-pulse p-4"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isComplete = item.status === "complete";
            const isPartial = item.status === "partial";

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isComplete
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40"
                    : isPartial
                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40"
                    : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isComplete
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : isPartial
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {item.title}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        isComplete
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                          : isPartial
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
                      }`}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 size={12} /> Lengkap
                        </>
                      ) : isPartial ? (
                        <>
                          <Clock size={12} /> Belum Selesai
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} /> Belum Diisi
                        </>
                      )}
                    </span>
                  </div>

                  <div className="pl-8 space-y-1">
                    {item.detailLines.map((line, lIdx) => {
                      const match = line.match(/(.*?)( - \(\d+\/\d+\s+[^)]+\)\.?)/);
                      return (
                        <div key={lIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold select-none">•</span>
                          {match ? (
                            <span className="leading-relaxed">
                              {match[1]}
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{match[2]}</span>
                            </span>
                          ) : (
                            <span className="leading-relaxed">{line}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 pl-8 flex justify-end">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm ${
                      isComplete
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        : isPartial
                        ? "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500"
                        : "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-500"
                    }`}
                  >
                    {isComplete ? "Lihat Data" : "Lengkapi Data"}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
import type { GradeSubject } from "@/types/nilai-harian";

interface IncompleteDataWidgetProps {
  userGrade: string | null;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  status: "complete" | "partial" | "missing";
  detail: string;
  href: string;
  icon: typeof AlertCircle;
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

      const [todayAttendanceRes, studentsRes, gradeSubjectsRes] = await Promise.all([
        StudentAttendanceService.getByGradeAndDate(userGrade, todayStr).catch(() => null),
        StudentAttendanceService.getStudentsByGrade(userGrade).catch(() => null),
        GradeSubjectService.getAll({ grade: userGrade }).catch(() => null),
      ]);

      const todayAttendance = Array.isArray(todayAttendanceRes?.data) ? todayAttendanceRes.data : [];
      const students = Array.isArray(studentsRes?.data) ? studentsRes.data : [];
      const rawSubjects: GradeSubject[] =
        (gradeSubjectsRes as any)?.result ||
        (gradeSubjectsRes as any)?.data ||
        (Array.isArray(gradeSubjectsRes) ? gradeSubjectsRes : []);

      const totalStudents = students.length;
      const recordedCount = todayAttendance.length;

      let presensiStatus: "complete" | "partial" | "missing" = "missing";
      let presensiDetail = `Presensi hari ini (${todayStr}) belum diinput.`;

      if (recordedCount > 0 && totalStudents > 0) {
        if (recordedCount >= totalStudents) {
          presensiStatus = "complete";
          presensiDetail = `Presensi hari ini (${todayStr}) sudah 100% lengkap (${recordedCount}/${totalStudents} murid).`;
        } else {
          presensiStatus = "partial";
          presensiDetail = `Baru ${recordedCount} dari ${totalStudents} murid yang terisi presensinya hari ini (${todayStr}).`;
        }
      } else if (totalStudents === 0) {
        presensiStatus = "complete";
        presensiDetail = `Belum ada murid terdaftar di Kelas ${userGrade}.`;
      }

      const checkList: ChecklistItem[] = [
        {
          id: "presensi",
          title: "Presensi Harian Kelas",
          category: "Absensi Murid",
          status: presensiStatus,
          detail: presensiDetail,
          href: "/presensi-murid",
          icon: CalendarCheck,
        },
      ];

      // Fetch task details for subjects in parallel to generate highly specific details
      if (rawSubjects.length > 0) {
        const topSubjects = rawSubjects.slice(0, 4);
        const taskResults = await Promise.all(
          topSubjects.map((s) => TaskService.getAll(s._id, "tugas").catch(() => null))
        );

        topSubjects.forEach((subj, idx) => {
          const name = subj.subjectName || "Mata Pelajaran";
          const res = taskResults[idx];
          const taskList = (res as any)?.result || (res as any)?.data || (Array.isArray(res) ? res : []);
          const taskCount = taskList.length;

          let status: "complete" | "partial" | "missing" = "partial";
          let detail = `Mata pelajaran ${name} belum memiliki tugas atau nilainya belum diisi lengkap.`;

          if (taskCount > 0) {
            const taskNames = taskList.slice(0, 2).map((t: any) => t.name).join(", ");
            detail = `Terdapat ${taskCount} tugas (${taskNames}${taskCount > 2 ? "..." : ""}) pada ${name} yang perlu dilengkapi nilainya.`;
          } else {
            status = "missing";
            detail = `Belum ada tugas/penilaian yang dibuat untuk mata pelajaran ${name} (Kelas ${userGrade}).`;
          }

          checkList.push({
            id: `subj-tugas-${subj._id}`,
            title: `Tugas ${name}`,
            category: "Nilai Tugas",
            status,
            detail,
            href: `/penilaian?subjectId=${subj._id}&category=tugas`,
            icon: FileSpreadsheet,
          });
        });
      } else {
        checkList.push({
          id: "nilai-harian",
          title: "Penilaian Harian & Tugas",
          category: "Nilai Akademik",
          status: "partial",
          detail: `Belum ada mata pelajaran terdaftar untuk Kelas ${userGrade}.`,
          href: "/penilaian?category=tugas",
          icon: FileSpreadsheet,
        });
      }

      // Add Karakter & Litnum items
      checkList.push(
        {
          id: "karakter",
          title: "Penilaian Karakter & Habits",
          category: "Karakter",
          status: "partial",
          detail: `Pencatatan 7 kebiasaan anak saleh & karakter murid Kelas ${userGrade} belum lengkap minggu ini.`,
          href: "/penilaian-karakter",
          icon: HeartHandshake,
        },
        {
          id: "litnum",
          title: "Literasi & Numerasi (TKA)",
          category: "Litnum",
          status: "partial",
          detail: `Periksa & lengkapi capaian skor Tes Kemampuan Akademik (TKA) murid Kelas ${userGrade}.`,
          href: "/nilai-litnum",
          icon: BookOpen,
        }
      );

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
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Pusat Kelengkapan Data Kelas {userGrade || ""}
            </h3>
            {incompleteCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                {incompleteCount} Perlu Perhatian
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Informasi spesifik per mata pelajaran dan presensi murid untuk langsung dilengkapi
          </p>
        </div>

        <button
          onClick={fetchChecklist}
          disabled={loading}
          className="self-start sm:self-center text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh Status
        </button>
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
                  <div className="flex items-center justify-between gap-2 mb-1.5">
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
                          <Clock size={12} /> Perlu Dicek
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} /> Belum Ada Tugas
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-8 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-3 pl-8 flex justify-end">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.2 rounded-lg transition-colors shadow-sm ${
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

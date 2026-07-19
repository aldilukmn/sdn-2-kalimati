"use client";

import { useState } from "react";
import HabitRadioGroup from "./HabitRadioGroup";
import type { CharacterHabit } from "@/types/character-habit";
import { Trash2, RotateCcw, Eye } from "lucide-react";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/components/common/Pagination";

interface StudentRow {
  studentId: string;
  name: string;
}

interface StudentScore {
  [habitId: string]: string;
}

interface Props {
  students: StudentRow[];
  habits: CharacterHabit[];
  scores: Record<string, StudentScore>;
  existingAssessments: Record<string, string>;
  onScoreChange: (studentId: string, habitId: string, value: "A" | "B" | "C" | "D") => void;
  onEdit: (assessmentId: string) => void;
  onDelete: (assessmentId: string, studentName: string) => void;
  onViewDetail?: (assessmentId: string) => void;
  saving: boolean;
  saveButton?: React.ReactNode;
  headerSlot?: React.ReactNode;
}

export default function StudentAssessmentTable({
  students,
  habits,
  scores,
  existingAssessments,
  onScoreChange,
  onEdit,
  onDelete,
  onViewDetail,
  saving,
  saveButton,
  headerSlot,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleReset = async (id: string) => {
    setResettingId(id);
    try {
      await onEdit(id);
    } finally {
      setResettingId(null);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          Belum ada kebiasaan karakter. Tambahkan kebiasaan terlebih dahulu.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      {headerSlot && <div className="mb-3">{headerSlot}</div>}

      {/* Table */}
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm">
              <th className="px-3 py-3 text-center font-semibold w-12 whitespace-nowrap">No</th>
              <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Nama</th>
              {habits.map((h) => (
                <th key={h._id} className="px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[60px] border-r border-gray-200/50 dark:border-gray-700/50 last:border-r-0">
                  {h.name}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-semibold whitespace-nowrap w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {students.length === 0 ? (
              <tr>
                <td colSpan={3 + habits.length + 1} className="p-3 text-center text-sm text-gray-400 dark:text-gray-500">
                  Tidak ada siswa di kelas ini
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student, idx) => {
                const assessmentId = existingAssessments[student.studentId];
                return (
                  <tr
                    key={student.studentId}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-300 text-center">{startIndex + idx + 1}</td>
                    <td className="p-3">
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">{student.name}</span>
                    </td>
                    {habits.map((h) => (
                      <td key={h._id} className="p-3 text-center border-r border-gray-200/50 dark:border-gray-700/50">
                        <HabitRadioGroup
                          value={scores[student.studentId]?.[h._id] || ""}
                          onChange={(val) => onScoreChange(student.studentId, h._id, val)}
                          disabled={saving}
                        />
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {assessmentId ? (
                          <>
                            {onViewDetail && (
                              <button
                                type="button"
                                onClick={() => onViewDetail(assessmentId)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 transition-colors"
                                title="Detail"
                                aria-label={`Lihat detail penilaian ${student.name}`}
                              >
                                <Eye size={14} aria-hidden="true" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleReset(assessmentId)}
                              disabled={saving || resettingId === assessmentId}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                              title="Reset"
                              aria-label={`Reset penilaian ${student.name}`}
                            >
                              <RotateCcw size={14} aria-hidden="true" className={resettingId === assessmentId ? "animate-spin" : ""} style={resettingId === assessmentId ? { animationDirection: "reverse" } : undefined} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(assessmentId, student.name)}
                              disabled={saving}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                              title="Hapus"
                              aria-label={`Hapus penilaian ${student.name}`}
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Baru</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={students.length}
        />
      )}

      {saveButton && <div className="mt-4">{saveButton}</div>}
    </div>
  );
}

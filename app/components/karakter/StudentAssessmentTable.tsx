"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HabitRadioGroup from "./HabitRadioGroup";
import type { CharacterHabit } from "@/types/character-habit";
import { Trash2, RotateCcw, Eye } from "lucide-react";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Pagination from "@/app/components/Pagination";

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
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        Belum ada kebiasaan karakter. Tambahkan kebiasaan terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <TableHead className="w-12 text-center text-xs font-semibold text-white">No</TableHead>
            <TableHead className="text-xs font-semibold text-white">Nama</TableHead>
            {habits.map((h) => (
              <TableHead key={h._id} className="text-center text-xs font-semibold text-white min-w-[60px]">
                {h.name}
              </TableHead>
            ))}
            <TableHead className="w-20 text-center text-xs font-semibold text-white">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3 + habits.length + 1} className="text-center py-12 text-slate-500 dark:text-slate-400">
                Tidak ada siswa di kelas ini
              </TableCell>
            </TableRow>
          ) : (
            paginatedStudents.map((student, idx) => {
              const assessmentId = existingAssessments[student.studentId];
              return (
                <TableRow key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell className="text-center text-xs text-slate-500">{startIndex + idx + 1}</TableCell>
                  <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-200">{student.name}</TableCell>
                  {habits.map((h) => (
                    <TableCell key={h._id} className="text-center">
                      <HabitRadioGroup
                        value={scores[student.studentId]?.[h._id] || ""}
                        onChange={(val) => onScoreChange(student.studentId, h._id, val)}
                        disabled={saving}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
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
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={students.length}
          />
        </div>
      )}

      {saveButton && <div className="mt-4">{saveButton}</div>}
    </div>
  );
}

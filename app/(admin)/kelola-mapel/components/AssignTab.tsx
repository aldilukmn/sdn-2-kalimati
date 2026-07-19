"use client";

import { Plus, Trash2, BookOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GradeSubject } from "@/types/nilai-harian";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import TableSkeleton from "@/components/tables/TableSkeleton";

interface AssignTabProps {
  error: string | null;
  retry: () => void;
  loading: boolean;
  gradeSubjects: GradeSubject[];
  openAssignModal: () => void;
  setConfirmDelete: (v: { type: "gradeSubject"; id: string; name: string } | null) => void;
}

export default function AssignTab({
  error,
  retry,
  loading,
  gradeSubjects,
  openAssignModal,
  setConfirmDelete,
}: AssignTabProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex justify-end mb-4">
        <button
          onClick={openAssignModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Tetapkan Mapel
        </button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : loading ? (
        <TableSkeleton headers={["No", "Mapel", "Kelas", "Semester", "Tahun Ajaran", "Aksi"]} rows={3} />
      ) : gradeSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Belum ada Mata Pelajaran yang ditetapkan ke kelas ini."
          description="Tetapkan mata pelajaran terlebih dahulu."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-indigo-700 hover:bg-indigo-700">
                <TableHead className="text-white text-center whitespace-nowrap">No</TableHead>
                <TableHead className="text-white whitespace-nowrap">Mapel</TableHead>
                <TableHead className="text-white whitespace-nowrap">Kelas</TableHead>
                <TableHead className="text-white whitespace-nowrap">Semester</TableHead>
                <TableHead className="text-white whitespace-nowrap">Tahun Ajaran</TableHead>
                <TableHead className="text-white text-right whitespace-nowrap">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeSubjects.map((gs, index) => (
                <TableRow key={gs._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">{index + 1}</TableCell>
                  <TableCell className="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">{gs.subjectName || "-"}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300 whitespace-nowrap">Kelas {gs.grade}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300 whitespace-nowrap">Semester {gs.semester}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300 whitespace-nowrap">{gs.academicYear}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setConfirmDelete({ type: "gradeSubject", id: gs._id, name: gs.subjectName || gs._id })}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

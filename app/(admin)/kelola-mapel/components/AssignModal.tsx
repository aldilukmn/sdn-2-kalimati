"use client";

import Modal from "@/app/components/Modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADES, SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  assignSubjectId: string;
  setAssignSubjectId: (v: string) => void;
  subjects: { _id: string; name: string }[];
  assignGrades: string[];
  toggleGrade: (grade: string) => void;
  assignSemester: string;
  setAssignSemester: (v: string) => void;
  assignAcademicYear: string;
  setAssignAcademicYear: (v: string) => void;
  assignSaving: boolean;
  handleSaveAssign: () => void;
}

export default function AssignModal({
  open,
  onClose,
  assignSubjectId,
  setAssignSubjectId,
  subjects,
  assignGrades,
  toggleGrade,
  assignSemester,
  setAssignSemester,
  assignAcademicYear,
  setAssignAcademicYear,
  assignSaving,
  handleSaveAssign,
}: AssignModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Tetapkan Mata Pelajaran ke Kelas" className="max-w-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
          <Select value={assignSubjectId} onValueChange={(v) => v && setAssignSubjectId(v)}>
            <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              <SelectValue placeholder="Pilih Mapel">
                {assignSubjectId ? subjects.find(s => s._id === assignSubjectId)?.name : "Pilih Mapel"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mata Pelajaran</SelectLabel>
                {subjects.map((s) => (
                  <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kelas</label>
          <div className="grid grid-cols-3 gap-2">
            {GRADES.map((g) => (
              <label
                key={g}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                  assignGrades.includes(g)
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={assignGrades.includes(g)}
                  onChange={() => toggleGrade(g)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                Kelas {g}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
          <Select value={assignSemester} onValueChange={(v) => v && setAssignSemester(v)}>
            <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Semester</SelectLabel>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tahun Ajaran</label>
          <Select value={assignAcademicYear} onValueChange={(v) => v && setAssignAcademicYear(v)}>
            <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
              <SelectValue placeholder="Pilih tahun ajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun Ajaran</SelectLabel>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSaveAssign}
            disabled={assignSaving || !assignSubjectId || assignGrades.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            {assignSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Tetapkan{assignGrades.length > 0 ? ` ke ${assignGrades.length} Kelas` : ""}
          </button>
        </div>
      </div>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import PageHero from "@/components/layout/PageHero";
import { NotebookPen, Plus, Loader2, Calendar } from "lucide-react";
import RichTextEditor from "@/components/catatan/RichTextEditor";
import NoteCard from "@/components/catatan/NoteCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_YEARS } from "@/lib/constants";
import { MONTHS_ID, getTodayLocal } from "@/lib/format";
import DateDayPicker from "@/components/common/DateDayPicker";

export default function CatatanPage() {
  const { grade } = useAuth();
  const {
    notes,
    loading,
    gradeSubjects,
    selectedGradeSubject,
    setSelectedGradeSubject,
    month,
    setMonth,
    year,
    setYear,
    isFetchingSubjects,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes(grade);

  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  const handleAdd = async () => {
    setIsSaving(true);
    await addNote(newContent, newDate);
    setIsSaving(false);
    setIsAdding(false);
    setNewContent("");
  };



  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={NotebookPen}
        title="Catatan Mengajar"
        description="Jurnal refleksi dan catatan harian per mata pelajaran."
      />

      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Bulan */}
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Bulan</label>
            <Select value={month} onValueChange={(v) => v && setMonth(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih Bulan">
                  {month && MONTHS_ID.length > 0 ? MONTHS_ID[Number(month) - 1] : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bulan</SelectLabel>
                  {MONTHS_ID.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tahun */}
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Tahun</label>
            <Select value={year} onValueChange={(v) => v && setYear(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  {AVAILABLE_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Mapel */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider mb-2">Mata Pelajaran</label>
            <Select value={selectedGradeSubject} onValueChange={(v) => v && setSelectedGradeSubject(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <span data-slot="select-value" className="flex flex-1 text-left truncate">
                  {selectedGradeSubject ? gradeSubjects.find(gs => gs._id === selectedGradeSubject)?.subjectName || "-" : (gradeSubjects.length === 0 ? "Tidak Ada Mapel" : "Pilih Mapel")}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mata Pelajaran</SelectLabel>
                  {gradeSubjects.map((gs) => (
                    <SelectItem key={gs._id} value={gs._id}>{gs.subjectName || "-"}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-10">

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            disabled={!selectedGradeSubject}
            className="w-full py-3 md:py-4 border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-center gap-2 text-sm md:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Tambah Catatan Baru
          </button>
        ) : (
          <div className="bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-xl space-y-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h3 className="font-medium text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <NotebookPen size={18} />
                Catatan Baru
              </h3>
              <div className="w-full sm:w-64">
                <DateDayPicker
                  value={newDate}
                  onChange={setNewDate}
                  max={getTodayLocal()}
                />
              </div>
            </div>
            
            <RichTextEditor
              content={newContent}
              onChange={setNewContent}
            />
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewContent("");
                }}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                disabled={!newContent || !newDate || isSaving}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? "Menyimpan..." : "Simpan Catatan"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 ml-1">
          Daftar Catatan
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <NotebookPen size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Belum ada catatan di bulan ini
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 max-w-sm">
              Klik "Tambah Catatan Baru" di atas untuk mulai membuat jurnal mengajar Anda.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

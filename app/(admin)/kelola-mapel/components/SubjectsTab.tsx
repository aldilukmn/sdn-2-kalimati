"use client";

import { Search, X, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subject } from "@/types/nilai-harian";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import TableSkeleton from "@/components/tables/TableSkeleton";

interface SubjectsTabProps {
  search: string;
  setSearch: (v: string) => void;
  openCreateSubject: () => void;
  error: string | null;
  retry: () => void;
  loading: boolean;
  filteredSubjects: Subject[];
  openEditSubject: (subject: Subject) => void;
  setConfirmDelete: (v: { type: "subject"; id: string; name: string } | null) => void;
}

export default function SubjectsTab({
  search,
  setSearch,
  openCreateSubject,
  error,
  retry,
  loading,
  filteredSubjects,
  openEditSubject,
  setConfirmDelete,
}: SubjectsTabProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-auto pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-blue-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={openCreateSubject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Tambah Mapel
        </button>
      </div>

      {/* Table */}
      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : loading ? (
        <TableSkeleton headers={["No", "Nama Mapel", "Aksi"]} rows={3} />
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? "Tidak ada mata pelajaran yang cocok" : "Belum ada Mata Pelajaran."}
          description={!search ? "Silakan tambahkan Mata Pelajaran terlebih dahulu." : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-indigo-700 hover:bg-indigo-700">
                <TableHead className="text-white text-center whitespace-nowrap">No</TableHead>
                <TableHead className="text-white whitespace-nowrap">Nama Mapel</TableHead>
                <TableHead className="text-white text-right whitespace-nowrap">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject, index) => (
                <TableRow key={subject._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">{index + 1}</TableCell>
                  <TableCell className="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">{subject.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditSubject(subject)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                        title="Ubah"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ type: "subject", id: subject._id, name: subject.name })}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

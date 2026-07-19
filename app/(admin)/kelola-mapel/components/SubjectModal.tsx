"use client";

import Modal from "@/components/modals/Modal";

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  subjectModal: { open: boolean; edit?: { _id: string; name: string } };
  subjectName: string;
  setSubjectName: (v: string) => void;
  subjectSaving: boolean;
  handleSaveSubject: () => void;
}

export default function SubjectModal({
  open,
  onClose,
  subjectModal,
  subjectName,
  setSubjectName,
  subjectSaving,
  handleSaveSubject,
}: SubjectModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={subjectModal.edit ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"} className="max-w-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Mata Pelajaran</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Masukkan nama mata pelajaran"
            className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-blue-400"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleSaveSubject(); }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSaveSubject}
            disabled={subjectSaving || !subjectName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            {subjectSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {subjectModal.edit ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

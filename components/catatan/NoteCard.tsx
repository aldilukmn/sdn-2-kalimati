import React, { useState } from "react";
import { Note } from "@/types/note";
import { formatDateWithDayID } from "@/lib/format";
import { Calendar, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import Modal from "@/components/modals/Modal";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await onUpdate(note._id, editContent);
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(note._id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md">
          <Calendar size={14} />
          {formatDateWithDayID(note.date)}
        </div>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                title="Edit Catatan"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Hapus Catatan"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="p-2 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Simpan"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(note.content);
                }}
                disabled={isUpdating}
                className="p-2 rounded-lg text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Batal"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-2">
        {isEditing ? (
          <RichTextEditor
            content={editContent}
            onChange={setEditContent}
          />
        ) : (
            <div
              className="prose-catatan text-sm sm:text-base text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          )}
        </div>

        <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="max-w-sm">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">Hapus Catatan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-gray-600 hover:bg-slate-100 transition-colors dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Hapus
            </button>
          </div>
        </Modal>
      </div>
  );
}

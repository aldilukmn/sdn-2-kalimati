import { useState, useEffect } from "react";
import NoteService from "@/services/note.service";
import type { Note } from "@/types/note";
import toast from "react-hot-toast";
import GradeSubjectService from "@/services/grade-subject.service";
import type { GradeSubject } from "@/types/nilai-harian";

export function useNotes(userGrade: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGradeSubject, setSelectedGradeSubject] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);

  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));

  // Fetch Mapel sesuai kelas guru
  useEffect(() => {
    if (!userGrade) return;

    const fetchGradeSubjects = async () => {
      setIsFetchingSubjects(true);
      try {
        const res = await GradeSubjectService.getAll({ grade: userGrade });
        const subjects = res.result || [];
        setGradeSubjects(subjects);
        if (subjects.length > 0 && !selectedGradeSubject) {
          setSelectedGradeSubject(subjects[0]._id);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(e.message || "Gagal memuat mata pelajaran");
        }
      } finally {
        setIsFetchingSubjects(false);
      }
    };

    fetchGradeSubjects();
  }, [userGrade]);

  // Fetch catatan berdasarkan mapel dan bulan yang dipilih
  const fetchNotes = async () => {
    if (!selectedGradeSubject) return;

    setLoading(true);
    try {
      const res = await NoteService.getAll(selectedGradeSubject, parseInt(month), parseInt(year));
      setNotes(res.result || []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Gagal memuat catatan");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedGradeSubject, month, year]);

  const addNote = async (content: string, noteDate: string) => {
    if (!selectedGradeSubject || !content || !noteDate) {
      toast.error("Data catatan tidak lengkap");
      return;
    }

    try {
      await NoteService.create({
        gradeSubjectId: selectedGradeSubject,
        content,
        date: noteDate,
      });
      toast.success("Catatan berhasil ditambahkan");
      fetchNotes();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Gagal menambahkan catatan");
      }
    }
  };

  const updateNote = async (id: string, content: string) => {
    if (!content) {
      toast.error("Konten catatan tidak boleh kosong");
      return;
    }

    try {
      await NoteService.update(id, { content });
      toast.success("Catatan berhasil diupdate");
      fetchNotes();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Gagal mengupdate catatan");
      }
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await NoteService.remove(id);
      toast.success("Catatan berhasil dihapus");
      fetchNotes();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Gagal menghapus catatan");
      }
    }
  };

  return {
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
    refreshNotes: fetchNotes,
  };
}

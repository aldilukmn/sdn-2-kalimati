"use client";

import { useEffect, useState, useCallback } from "react";
import SubjectService from "@/services/subject.service";
import GradeSubjectService from "@/services/grade-subject.service";
import type { Subject, GradeSubject } from "@/types/nilai-harian";
import { GRADES } from "@/lib/constants";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [subjectModal, setSubjectModal] = useState<{ open: boolean; edit?: Subject }>({ open: false });
  const [subjectName, setSubjectName] = useState("");
  const [subjectSaving, setSubjectSaving] = useState(false);

  const [assignModal, setAssignModal] = useState(false);
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignGrade, setAssignGrade] = useState("1");
  const [assignSemester, setAssignSemester] = useState("1");
  const [assignAcademicYear, setAssignAcademicYear] = useState("2025/2026");
  const [assignSaving, setAssignSaving] = useState(false);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await SubjectService.getAll();
      setSubjects(res?.result || []);
    } catch {
      setSubjects([]);
    }
  }, []);

  const fetchGradeSubjects = useCallback(async () => {
    try {
      const res = await GradeSubjectService.getAll();
      setGradeSubjects(res?.result || []);
    } catch {
      setGradeSubjects([]);
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSubjects(), fetchGradeSubjects()]);
      } catch {
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [fetchSubjects, fetchGradeSubjects]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSubjects(), fetchGradeSubjects()]);
        setError(null);
      } catch {
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [fetchSubjects, fetchGradeSubjects]);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Subject CRUD
  const openCreateSubject = () => {
    setSubjectName("");
    setSubjectModal({ open: true });
  };

  const openEditSubject = (subject: Subject) => {
    setSubjectName(subject.name);
    setSubjectModal({ open: true, edit: subject });
  };

  const closeSubjectModal = () => {
    setSubjectModal({ open: false });
    setSubjectName("");
  };

  const saveSubject = async () => {
    if (!subjectName.trim()) return;
    setSubjectSaving(true);
    try {
      if (subjectModal.edit) {
        await SubjectService.update(subjectModal.edit._id, { name: subjectName.trim() });
      } else {
        await SubjectService.create({ name: subjectName.trim() });
      }
      await fetchSubjects();
      closeSubjectModal();
    } catch {
      // error handled by caller via toast
    } finally {
      setSubjectSaving(false);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await SubjectService.remove(id);
      await fetchSubjects();
    } catch {
      // error handled by caller
    }
  };

  // GradeSubject CRUD
  const openAssignModal = () => {
    setAssignSubjectId("");
    setAssignGrade("1");
    setAssignSemester("1");
    setAssignAcademicYear("2025/2026");
    setAssignModal(true);
  };

  const closeAssignModal = () => {
    setAssignModal(false);
  };

  const saveAssign = async () => {
    if (!assignSubjectId) return;
    setAssignSaving(true);
    try {
      await GradeSubjectService.create({
        subjectId: assignSubjectId,
        grade: assignGrade,
        semester: assignSemester,
        academicYear: assignAcademicYear,
      });
      await fetchGradeSubjects();
      closeAssignModal();
    } catch {
      // error handled by caller
    } finally {
      setAssignSaving(false);
    }
  };

  const deleteGradeSubject = async (id: string) => {
    try {
      await GradeSubjectService.remove(id);
      await fetchGradeSubjects();
    } catch {
      // error handled by caller
    }
  };

  return {
    subjects,
    filteredSubjects,
    gradeSubjects,
    loading,
    error,
    retry,
    search,
    setSearch,
    // Subject modal
    subjectModal,
    subjectName,
    setSubjectName,
    subjectSaving,
    openCreateSubject,
    openEditSubject,
    closeSubjectModal,
    saveSubject,
    deleteSubject,
    // Assign modal
    assignModal,
    assignSubjectId,
    setAssignSubjectId,
    assignGrade,
    setAssignGrade,
    assignSemester,
    setAssignSemester,
    assignAcademicYear,
    setAssignAcademicYear,
    assignSaving,
    openAssignModal,
    closeAssignModal,
    saveAssign,
    deleteGradeSubject,
  };
}

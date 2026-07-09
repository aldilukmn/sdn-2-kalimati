"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ChapterService from "@/services/chapter.service";
import MaterialService from "@/services/material.service";
import GradeSubjectService from "@/services/grade-subject.service";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import type { Chapter, Material, GradeSubject, ReorderItem } from "@/types/nilai-harian";

export function useChapters() {
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [materialsMap, setMaterialsMap] = useState<Record<string, Material[]>>({});
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isJwtReady, setIsJwtReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    let role: string | null = null;
    let gradeFromToken: string | null = null;
    if (token) {
      try {
        const payload = decodeJWT(token);
        if (payload) { role = payload.role; gradeFromToken = payload.grade; }
      } catch {}
    }
    if (!role) {
      const match = document.cookie.match(/(?:^|; )user_role=([^;]*)/);
      role = match ? decodeURIComponent(match[1]) : null;
      const gradeMatch = document.cookie.match(/(?:^|; )user_grade=([^;]*)/);
      gradeFromToken = gradeMatch ? decodeURIComponent(gradeMatch[1]) : null;
    }
    if (role) setUserRole(role);
    if (role === "guru" && gradeFromToken) setGrade(gradeFromToken);
    else if (role && role !== "guru") setGrade("1");
    setIsJwtReady(true);
  }, []);

  // Chapter modal
  const [chapterModal, setChapterModal] = useState<{ open: boolean; edit?: Chapter }>({ open: false });
  const [chapterName, setChapterName] = useState("");
  const [chapterInputMode, setChapterInputMode] = useState<"per_chapter" | "per_material">("per_material");
  const [chapterSaving, setChapterSaving] = useState(false);

  // Material modal
  const [materialModal, setMaterialModal] = useState<{ open: boolean; chapterId: string; edit?: Material }>({ open: false, chapterId: "" });
  const [materialName, setMaterialName] = useState("");
  const [materialSaving, setMaterialSaving] = useState(false);

  const chapterSavingRef = useRef(false);
  const materialSavingRef = useRef(false);

  const fetchGradeSubjects = useCallback(async () => {
    try {
      const params = userRole === "guru" && grade ? { grade } : undefined;
      const res = await GradeSubjectService.getAll(params);
      const result = res?.result || [];
      setGradeSubjects(result);
      if (result.length === 0) {
        setSelectedGS("");
      } else if (selectedGS && !result.some((gs: { _id: string }) => gs._id === selectedGS)) {
        setSelectedGS("");
      }
    } catch {
      setGradeSubjects([]);
    }
  }, [userRole, grade]);

  const fetchChapters = useCallback(async (gsId: string) => {
    if (!gsId) return;
    setChaptersLoading(true);
    try {
      const res = await ChapterService.getAll(gsId);
      setChapters(res?.result || []);
    } catch {
      setChapters([]);
    } finally {
      setChaptersLoading(false);
    }
  }, []);

  const fetchMaterials = useCallback(async (chapterId: string) => {
    try {
      const res = await MaterialService.getAll(chapterId);
      setMaterialsMap((prev) => ({ ...prev, [chapterId]: res?.result || [] }));
    } catch {
      setMaterialsMap((prev) => ({ ...prev, [chapterId]: [] }));
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!isJwtReady || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchGradeSubjects();
      } catch {
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [fetchGradeSubjects, isJwtReady, grade, retryCount]);

  useEffect(() => {
    fetchChapters(selectedGS);
    setExpandedChapter(null);
  }, [selectedGS, fetchChapters]);

  const toggleExpandChapter = (chapterId: string) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      if (!materialsMap[chapterId]) fetchMaterials(chapterId);
    }
  };

  // Chapter CRUD
  const openCreateChapter = () => {
    setChapterName("");
    setChapterInputMode("per_material");
    setChapterModal({ open: true });
  };

  const openEditChapter = (chapter: Chapter) => {
    setChapterName(chapter.name);
    setChapterInputMode(chapter.inputMode);
    setChapterModal({ open: true, edit: chapter });
  };

  const closeChapterModal = () => {
    setChapterModal({ open: false });
    setChapterName("");
  };

  const saveChapter = async () => {
    if (!chapterName.trim() || !selectedGS) return;
    if (chapterSavingRef.current) return;
    chapterSavingRef.current = true;
    setChapterSaving(true);
    try {
      if (chapterModal.edit) {
        await ChapterService.update(chapterModal.edit._id, {
          name: chapterName.trim(),
          inputMode: chapterInputMode,
        });
      } else {
        await ChapterService.create({
          gradeSubjectId: selectedGS,
          name: chapterName.trim(),
          inputMode: chapterInputMode,
        });
      }
      await fetchChapters(selectedGS);
      closeChapterModal();
    } finally {
      setChapterSaving(false);
      chapterSavingRef.current = false;
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      await ChapterService.remove(id);
      await fetchChapters(selectedGS);
    } catch {
      // handled by caller
    }
  };

  const reorderChapters = async (items: ReorderItem[]) => {
    try {
      await ChapterService.reorder(selectedGS, items);
      await fetchChapters(selectedGS);
    } catch {
      // handled by caller
    }
  };

  // Material CRUD
  const openCreateMaterial = (chapterId: string) => {
    setMaterialName("");
    setMaterialModal({ open: true, chapterId });
  };

  const openEditMaterial = (chapterId: string, material: Material) => {
    setMaterialName(material.name);
    setMaterialModal({ open: true, chapterId, edit: material });
  };

  const closeMaterialModal = () => {
    setMaterialModal({ open: false, chapterId: "" });
    setMaterialName("");
  };

  const saveMaterial = async () => {
    if (!materialName.trim() || !materialModal.chapterId) return;
    if (materialSavingRef.current) return;
    materialSavingRef.current = true;
    setMaterialSaving(true);
    try {
      if (materialModal.edit) {
        await MaterialService.update(materialModal.edit._id, { name: materialName.trim() });
      } else {
        await MaterialService.create({
          chapterId: materialModal.chapterId,
          name: materialName.trim(),
        });
      }
      await fetchMaterials(materialModal.chapterId);
      closeMaterialModal();
    } finally {
      setMaterialSaving(false);
      materialSavingRef.current = false;
    }
  };

  const deleteMaterial = async (chapterId: string, materialId: string) => {
    try {
      await MaterialService.remove(materialId);
      await fetchMaterials(chapterId);
    } catch {
      // handled by caller
    }
  };

  const reorderMaterials = async (chapterId: string, items: ReorderItem[]) => {
    await MaterialService.reorder(chapterId, items);
    await fetchMaterials(chapterId);
  };

  return {
    gradeSubjects,
    grade,
    setGrade,
    userRole,
    selectedGS,
    setSelectedGS,
    chapters,
    materialsMap,
    expandedChapter,
    toggleExpandChapter,
    loading,
    error,
    retry,
    chaptersLoading,
    fetchMaterials,
    // Chapter modal
    chapterModal,
    chapterName,
    setChapterName,
    chapterInputMode,
    setChapterInputMode,
    chapterSaving,
    openCreateChapter,
    openEditChapter,
    closeChapterModal,
    saveChapter,
    deleteChapter,
    reorderChapters,
    // Material modal
    materialModal,
    materialName,
    setMaterialName,
    materialSaving,
    openCreateMaterial,
    openEditMaterial,
    closeMaterialModal,
    saveMaterial,
    deleteMaterial,
    reorderMaterials,
  };
}

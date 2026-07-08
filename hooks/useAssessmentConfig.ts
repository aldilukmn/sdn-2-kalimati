"use client";

import { useEffect, useState, useCallback } from "react";
import AssessmentConfigService from "@/services/assessment-config.service";
import type { AssessmentConfig, AssessmentComponent } from "@/types/nilai-harian";

const SEMESTERS = ["1", "2"];
const ACADEMIC_YEARS = ["2026/2027"];

export function useAssessmentConfig() {
  const [grade, setGrade] = useState("");
  const [configs, setConfigs] = useState<AssessmentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AssessmentConfig | null>(null);
  const [modalGrade, setModalGrade] = useState("1");
  const [modalSemester, setModalSemester] = useState("1");
  const [modalAcademicYear, setModalAcademicYear] = useState("2026/2027");
  const [components, setComponents] = useState<AssessmentComponent[]>([]);
  const [modalSaving, setModalSaving] = useState(false);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await AssessmentConfigService.getAll(grade ? { grade } : undefined);
        setConfigs(res?.result || []);
      } catch {
        setConfigs([]);
        setError("Gagal memuat konfigurasi penilaian.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [grade, retryCount]);

  const openCreateModal = () => {
    setEditingConfig(null);
    setModalGrade("1");
    setModalSemester("1");
    setModalAcademicYear("2026/2027");
    setComponents([
      { key: "harian", name: "Nilai Harian", weight: 70 },
      { key: "asts", name: "ASTS", weight: 15 },
      { key: "asas", name: "ASAS", weight: 15 },
    ]);
    setModalOpen(true);
  };

  const openEditModal = (config: AssessmentConfig) => {
    setEditingConfig(config);
    setModalGrade(config.grade);
    setModalSemester(config.semester);
    setModalAcademicYear(config.academicYear);
    setComponents(config.components.map((c) => ({ ...c })));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingConfig(null);
  };

  const addComponent = () => {
    setComponents((prev) => [...prev, { key: "", name: "", weight: 0 }]);
  };

  const removeComponent = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: keyof AssessmentComponent, value: string | number) => {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const totalWeight = components.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isValid = totalWeight === 100 && components.some((c) => c.key === "harian") && components.every((c) => c.key.trim() && c.name.trim());
  const keys = components.map((c) => c.key.trim()).filter(Boolean);
  const hasDuplicateKeys = keys.length !== new Set(keys).size;
  const canSave = isValid && !hasDuplicateKeys;

  const formulaPreview = components
    .filter((c) => Number(c.weight) > 0)
    .map((c) => {
      const label = c.name.trim() || c.key.trim() || "?";
      return `${label} × ${c.weight}%`;
    })
    .join("\n  + ");

  const handleSave = async () => {
    setModalSaving(true);
    try {
      if (editingConfig) {
        await AssessmentConfigService.update(editingConfig._id, { components });
      } else {
        await AssessmentConfigService.create({
          grade: modalGrade,
          semester: modalSemester,
          academicYear: modalAcademicYear,
          components,
        });
      }
      closeModal();
      setRetryCount((c) => c + 1);
      return true;
    } catch {
      return false;
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await AssessmentConfigService.remove(id);
      setRetryCount((c) => c + 1);
      return true;
    } catch {
      return false;
    }
  };

  return {
    grade, setGrade,
    configs, loading, error, retry,
    modalOpen, editingConfig, openCreateModal, openEditModal, closeModal,
    modalGrade, setModalGrade,
    modalSemester, setModalSemester,
    modalAcademicYear, setModalAcademicYear,
    components, addComponent, removeComponent, updateComponent,
    totalWeight, isValid, canSave, hasDuplicateKeys,
    formulaPreview,
    modalSaving, handleSave, handleDelete,
    SEMESTERS, ACADEMIC_YEARS,
  };
}

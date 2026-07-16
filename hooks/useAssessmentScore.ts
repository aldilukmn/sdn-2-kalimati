"use client";

import { useAuth } from "@/hooks/useAuth";
import { SEMESTERS, ACADEMIC_YEARS } from "@/lib/constants";

import { useAssessmentConfig } from "./assessment/useAssessmentConfig";
import { useAssessmentStudents } from "./assessment/useAssessmentStudents";
import { useHarianData } from "./assessment/useHarianData";
import { useTugasData } from "./assessment/useTugasData";
import { useKarakterData } from "./assessment/useKarakterData";
import { usePresensiData } from "./assessment/usePresensiData";
import { useNonHarianData } from "./assessment/useNonHarianData";
import { useState } from "react";

export type { KarakterStudent } from "./assessment/useKarakterData";

export function useAssessmentScore() {
  const { role, grade: authGrade } = useAuth();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 1. Config & State Management
  const configHook = useAssessmentConfig(role, authGrade);
  
  // 2. Base Students Data
  const studentsHook = useAssessmentStudents(role, configHook.grade, configHook.retryCount);
  
  // 3. Component Datas
  const harianHook = useHarianData(
    configHook.selectedComponentKey,
    configHook.selectedGS,
    studentsHook.students,
    configHook.retryCount,
    setGlobalError,
    configHook.safeKey
  );
  
  const tugasHook = useTugasData(
    configHook.selectedComponentKey,
    configHook.selectedGS,
    studentsHook.students,
    configHook.retryCount,
    setGlobalError,
    configHook.safeKey
  );

  const karakterHook = useKarakterData(
    configHook.selectedComponentKey,
    role,
    configHook.grade,
    configHook.semester,
    configHook.academicYear,
    studentsHook.students,
    configHook.retryCount,
    configHook.safeKey
  );

  const presensiHook = usePresensiData(
    configHook.selectedComponentKey,
    role,
    configHook.grade,
    configHook.semester,
    configHook.academicYear,
    studentsHook.students,
    configHook.retryCount,
    configHook.safeKey
  );

  const nonHarianHook = useNonHarianData(
    configHook.selectedComponentKey,
    configHook.selectedGS,
    configHook.gradeSubjects,
    configHook.semester,
    configHook.academicYear,
    configHook.retryCount,
    configHook.safeKey
  );

  return {
    ...configHook,
    ...studentsHook,
    ...harianHook,
    ...tugasHook,
    ...karakterHook,
    ...presensiHook,
    ...nonHarianHook,
    role,
    error: configHook.error || globalError,
    SEMESTERS, 
    ACADEMIC_YEARS,
  };
}

import { useEffect, useState, useCallback } from "react";
import GradeSubjectService from "@/services/grade-subject.service";
import AssessmentConfigService from "@/services/assessment-config.service";
import type { GradeSubject, AssessmentConfig } from "@/types/nilai-harian";

export function useAssessmentConfig(role: string | null, authGrade: string | null) {
  const [semester, setSemester] = useState("1");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (role === "guru" && authGrade) setGrade(authGrade);
    else if (role && role !== "guru") setGrade("1");
  }, [role, authGrade]);

  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGS, setSelectedGS] = useState("");

  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [selectedComponentKey, setSelectedComponentKey] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Fetch grade-subjects
  useEffect(() => {
    if (!role || !grade) return;
    const ctrl = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await GradeSubjectService.getAll({ grade, semester, academicYear });
        const result = res?.result || [];
        setGradeSubjects(result);
        if (result.length === 0) {
          setSelectedGS("");
        } else if (selectedGS) {
          const newSameSubject = result.find((gs: { subjectId: string }) => gs.subjectId === gradeSubjects.find((g) => g._id === selectedGS)?.subjectId);
          setSelectedGS(newSameSubject ? newSameSubject._id : "");
        }
      } catch {
        setGradeSubjects([]);
        setSelectedGS("");
        setError("Gagal memuat data mapel.");
      } finally {
        setInitialLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [role, grade, semester, academicYear, retryCount, selectedGS, gradeSubjects]);

  // Fetch active config
  useEffect(() => {
    if (!role || !grade) { setConfig(null); return; }
    const ctrl = new AbortController();
    (async () => {
      setConfigLoading(true);
      setConfigError(null);
      try {
        const res = await AssessmentConfigService.getActive({ grade, semester, academicYear });
        const cfg = res?.result || null;
        setConfig(cfg);
        const comps = cfg?.components || [];
        if (comps.length > 0) {
          const hasHarian = comps.find((c) => c.key === "harian");
          if (hasHarian) {
            setSelectedComponentKey("harian");
          } else {
            setSelectedComponentKey(comps[0].key);
          }
        }
      } catch {
        setConfig(null);
        setConfigError("Gagal memuat konfigurasi penilaian.");
      } finally {
        setConfigLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [role, grade, semester, academicYear, retryCount]);

  const safeKey = (key: string) => key?.trim().toLowerCase() || "";
  const components = config?.components || [];
  const nonHarianComponents = components.filter((c) => {
    const k = safeKey(c.key);
    return k !== "harian" && k !== "presensi" && k !== "tugas" && k !== "karakter";
  });

  const selectedGSData = gradeSubjects.find((gs) => gs._id === selectedGS);
  const subjectId = selectedGSData?.subjectId || "";

  return {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    initialLoading, error, retry, retryCount,
    subjectId,
    safeKey
  };
}

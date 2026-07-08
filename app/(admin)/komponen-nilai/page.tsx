"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Save, AlertCircle } from "lucide-react";
import { useAssessmentScore } from "@/hooks/useAssessmentScore";
import { decodeJWT } from "@/lib/jwt";
import { GRADES } from "@/lib/constants";
import toast from "react-hot-toast";
import PageHero from "@/app/components/PageHero";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NilaiKomponenPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      const payload = decodeJWT(token);
      setUserRole(payload?.role || null);
      setUserGrade(payload?.grade || null);
    }
  }, []);

  const {
    semester, setSemester,
    academicYear, setAcademicYear,
    grade, setGrade,
    gradeSubjects, selectedGS, setSelectedGS,
    config, configLoading, configError,
    components, nonHarianComponents,
    selectedComponentKey, setSelectedComponentKey,
    students,
    harianScores, harianLoading,
    nonHarianScores, nonHarianLoading,
    saving, error, retry, initialLoading,
    handleScoreChange, handleSave,
    SEMESTERS, ACADEMIC_YEARS,
  } = useAssessmentScore(userRole, userGrade);

  const onSave = async () => {
    const ok = await handleSave();
    if (ok) {
      toast.success("Nilai berhasil disimpan");
    } else {
      toast.error("Gagal menyimpan nilai");
    }
  };

  const formulaPreview = config?.components
    ?.filter((c) => c.weight > 0)
    .map((c) => `${c.name} × ${c.weight}%`)
    .join(" + ");

  const isHarianTab = selectedComponentKey === "harian";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={ClipboardList} title="Komponen Nilai" description="Input nilai komponen penilaian (ASTS, ASAS, Proyek, dll)" />

      {/* Filter */}
      <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Semester</label>
            <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tahun Ajaran</label>
            <Select value={academicYear} onValueChange={(v) => v && setAcademicYear(v)}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
            <Select value={grade} onValueChange={(v) => v && setGrade(v)} disabled={userRole === "guru"}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mata Pelajaran</label>
            <Select value={selectedGS} onValueChange={(v) => v && setSelectedGS(v)} disabled={gradeSubjects.length === 0}>
              <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100"><SelectValue placeholder={gradeSubjects.length === 0 ? "Tidak ada mapel" : "Pilih mapel"}>
                {selectedGS ? gradeSubjects.find(gs => gs._id === selectedGS)?.subjectName || "-" : null}
              </SelectValue></SelectTrigger>
              <SelectContent>
                {gradeSubjects.map((gs) => (
                  <SelectItem key={gs._id} value={gs._id}>{gs.subjectName || "-"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-red-300 dark:text-red-600 mb-3" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button onClick={retry} className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        </div>
      ) : initialLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : !selectedGS || gradeSubjects.length === 0 ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Mapel untuk kelas ini.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hubungi Admin untuk menetapkan Mata Pelajaran terlebih dahulu.</p>
          </div>
        </div>
      ) : configLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : !config ? (
        <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
          <div className="text-center py-12">
            <AlertCircle size={40} className="mx-auto text-amber-300 dark:text-amber-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada Konfigurasi Penilaian aktif.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hubungi Admin untuk membuat Konfigurasi Penilaian terlebih dahulu.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Active config info */}
          {formulaPreview && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl px-5 py-3">
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-0.5">Konfigurasi Aktif:</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 font-semibold">
                Nilai Akhir = {formulaPreview}
              </p>
            </div>
          )}

          {/* Component tabs */}
          {components.length > 0 && (
            <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit flex-wrap">
              {components.map((comp) => (
                <button
                  key={comp.key}
                  onClick={() => setSelectedComponentKey(comp.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    selectedComponentKey === comp.key
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {comp.name}
                  {comp.key === "harian" && " (Readonly)"}
                </button>
              ))}
            </div>
          )}

          {/* Score table */}
          {isHarianTab ? (
            <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
              {harianLoading ? (
                <div className="animate-pulse p-5 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">Tidak ada siswa.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12">No</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Nama Siswa</th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-32">Rata-rata Nilai Harian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => (
                        <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                          <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{s.name}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {harianScores[s.studentId] !== undefined ? harianScores[s.studentId].toFixed(2) : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl overflow-hidden">
                {nonHarianLoading ? (
                  <div className="animate-pulse p-5 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    ))}
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">Tidak ada siswa.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12">No</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Nama Siswa</th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-40">
                            {components.find((c) => c.key === selectedComponentKey)?.name || selectedComponentKey}
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-28">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, idx) => {
                          const entry = nonHarianScores[s.studentId];
                          const score = entry?.score || "";
                          const status = entry?.status || "unsaved";
                          return (
                            <tr key={s.studentId} className="border-b border-slate-100 dark:border-slate-700/50">
                              <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{s.name}</td>
                              <td className="px-4 py-2.5 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={score}
                                  onChange={(e) => handleScoreChange(s.studentId, e.target.value)}
                                  className="w-24 px-3 py-1.5 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  status === "saved"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                }`}>
                                  {status === "saved" ? "✅ Tersimpan" : "⏳ Belum simpan"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                onClick={onSave}
                disabled={saving || nonHarianLoading || students.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer w-full"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Menyimpan..." : "💾 Simpan Semua"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

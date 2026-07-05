"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import RegistrationService from "@/services/registration.service";
import StudentDataStep from "@/app/components/pmb/StudentDataStep";
import ParentDataStep from "@/app/components/pmb/ParentDataStep";
import GuardianDataStep from "@/app/components/pmb/GuardianDataStep";
import LoadingModal from "@/app/components/LoadingModal";
import type { RegistrationForm } from "@/types/registration";

const emptyForm: RegistrationForm = {
  student: {
    fullName: "", nisn: "", nik: "", noKk: "", birthPlace: "", birthDate: "",
    gender: "", religion: "",
    address: { street: "", rt: "", rw: "", village: "", district: "", postalCode: "" },
    childOrder: "", numberOfSiblings: "", kindergartenOrigin: "",
  },
  contactPhoneNumber: "",
  father: { name: "", birthYear: "", occupation: "", education: "", monthlyIncome: "", nik: "" },
  mother: { name: "", birthYear: "", occupation: "", education: "", monthlyIncome: "", nik: "" },
  hasGuardian: false,
  guardian: { name: "", relationship: "", phoneNumber: "" },
};

export default function EditRegistration() {
  const params = useParams();
  const router = useRouter();
  const { userRole: authRole, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<RegistrationForm>(emptyForm);
  const [registrationInfo, setRegistrationInfo] = useState<{
    number: string; status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (authLoading || authRole !== "admin") return;
    const fetchData = async () => {
      try {
        const res = await RegistrationService.getById(params.id as string);
        const data = res.result || res.data || res;

        setRegistrationInfo({
          number: data.registrationNumber || "-",
          status: data.status || "unvalidated",
        });

        const student = data.student || {};
        const father = data.father || {};
        const mother = data.mother || {};
        const guardian = data.guardian;

        setFormData({
          hasGuardian: data.hasGuardian === true,
          student: {
            fullName: student.fullName || "",
            nisn: student.nisn || "",
            nik: student.nik || "",
            noKk: student.noKk || "",
            birthPlace: student.birthPlace || "",
            birthDate: student.birthDate || "",
            gender: student.gender || "",
            religion: student.religion || "",
            address: {
              street: student.address?.street || "",
              rt: student.address?.rt || "",
              rw: student.address?.rw || "",
              village: student.address?.village || "",
              district: student.address?.district || "",
              postalCode: student.address?.postalCode || "",
            },
            childOrder: student.childOrder || "",
            numberOfSiblings: student.numberOfSiblings || "",
            kindergartenOrigin: student.kindergartenOrigin || "",
          },
          contactPhoneNumber: data.contactPhoneNumber || "",
          father: {
            name: father.name || "",
            birthYear: father.birthYear || "",
            occupation: father.occupation || "",
            education: father.education || "",
            monthlyIncome: father.monthlyIncome || "",
            nik: father.nik || "",
          },
          mother: {
            name: mother.name || "",
            birthYear: mother.birthYear || "",
            occupation: mother.occupation || "",
            education: mother.education || "",
            monthlyIncome: mother.monthlyIncome || "",
            nik: mother.nik || "",
          },
          guardian: guardian
            ? {
                name: guardian.name || "",
                relationship: guardian.relationship || "",
                phoneNumber: guardian.phoneNumber || "",
              }
            : { name: "", relationship: "", phoneNumber: "" },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, authRole, authLoading]);

  // Route guard: hanya admin yang boleh akses
  useEffect(() => {
    if (!authLoading && authRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [authRole, authLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const { name } = target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    const keys = name.split(".");
    setFormData((prev) => {
      const newFormData = { ...prev };
      let current: any = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalStatus("loading");
    setError(null);

    try {
      const payload: Record<string, any> = {
        student: formData.student,
        father: formData.father,
        mother: formData.mother,
        contactPhoneNumber: formData.contactPhoneNumber,
        hasGuardian: formData.hasGuardian,
      };

      if (formData.hasGuardian) {
        payload.guardian = formData.guardian;
      }

      await RegistrationService.updateData(params.id as string, payload);
      setModalStatus("success");
      setTimeout(() => router.push("/data-pendaftar"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan");
      setModalStatus("error");
      setSubmitting(false);
    }
  };

  if (authLoading || authRole !== "admin") return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !registrationInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/data-pendaftar"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/data-pendaftar"
          className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <button
            type="button"
            className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg text-sm duration-300 text-white bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            <ArrowLeft size={18} />
            <span className="text-xs md:text-sm">Kembali</span>
          </button>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Edit Data Pendaftar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            No. Pendaftaran:{" "}
            <span className="font-semibold">{registrationInfo?.number}</span>
            {" | "}Status:{" "}
            <span
              className={`font-semibold ${
                registrationInfo?.status === "validated"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              {registrationInfo?.status === "validated"
                ? "Tervalidasi"
                : "Belum Tervalidasi"}
            </span>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <StudentDataStep formData={formData} onChange={handleChange} />
              <ParentDataStep formData={formData} onChange={handleChange} />
              <GuardianDataStep
                formData={formData}
                onChange={handleChange}
              />

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  <span>
                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {submitting && (
        <LoadingModal
          isOpen={submitting}
          status={modalStatus}
          title="Menyimpan Perubahan"
          message="Mohon tunggu, perubahan sedang disimpan..."
          successText="Perubahan berhasil disimpan!"
          errorText="Gagal menyimpan perubahan"
        />
      )}
    </div>
  );
}

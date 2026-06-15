"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "flowbite-react";
import RegistrationService from "@/services/registration.service";
import LoadingModal from "@/app/components/LoadingModal";
import RegistrationCounter from "@/app/components/RegistrationCounter";
import RegistrationCard from "@/app/components/RegistrationCard";
import BackButton from "@/app/components/BackButton";
import StudentDataStep from "@/app/components/spmb/StudentDataStep";
import ParentDataStep from "@/app/components/spmb/ParentDataStep";
import GuardianDataStep from "@/app/components/spmb/GuardianDataStep";

const initialFormData: RegistrationForm = {
  student: {
    fullName: "",
    nisn: "",
    nik: "",
    noKk: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    religion: "",
    address: {
      street: "",
      rt: "",
      rw: "",
      village: "",
      district: "",
      postalCode: "",
    },
    childOrder: "",
    numberOfSiblings: "",
    kindergartenOrigin: "",
  },
  contactPhoneNumber: "",
  father: {
    name: "",
    birthYear: "",
    occupation: "",
    education: "",
    monthlyIncome: "",
    nik: "",
  },
  mother: {
    name: "",
    birthYear: "",
    occupation: "",
    education: "",
    monthlyIncome: "",
    nik: "",
  },
  guardian: {
    name: "",
    relationship: "",
    phoneNumber: "",
  },
};

export default function Spmb() {
  const [formData, setFormData] = useState<RegistrationForm>(initialFormData);
  const [showWali, setShowWali] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"loading" | "success" | "error">("loading");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setCanSubmit(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    setCanSubmit(false);
  }, [currentStep]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
    setIsLoading(true);
    setModalStatus("loading");
    setError(null);

    try {
      const response = await RegistrationService.create(formData);
      if (response) {
        setIsRegistered(true);
      }
      setModalStatus("success");
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar";
      setError(errorMessage);
      setModalStatus("error");
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 md:gap-10 px-5 py-7 xl:py-10 dark:bg-gray-900">
      <BackButton />
      <div className="w-full max-w-5xl">
        {isRegistered ? (
          <div className="flex flex-col items-center justify-center w-full py-16 md:py-0 text-gray-800 dark:text-gray-200">
            <h2
              id="registration-success"
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              Pendaftaran Berhasil!
            </h2>
            <p
              id="data-pendaftaran"
              className="mb-8 text-center max-w-md text-sm md:text-base"
            >
              Data pendaftaran Anda telah tersimpan. Silakan unduh kartu bukti
              pendaftaran di bawah ini.
            </p>
            <RegistrationCard name={formData.student.fullName} />
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <RegistrationCounter />
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                Formulir Pendaftaran SPMB
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Isi semua data dengan lengkap dan benar
              </p>
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-start relative">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gray-300 dark:bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-700 ease-out"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  />
                </div>

                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all duration-500 relative z-10 ${
                        step <= currentStep
                          ? "bg-blue-600 text-white shadow-lg scale-110"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {step < currentStep ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-center text-gray-700 dark:text-gray-200">
                      {step === 1
                        ? "Data Peserta"
                        : step === 2
                          ? "Data Orang Tua"
                          : "Data Wali"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <StudentDataStep formData={formData} onChange={handleChange} />
              )}
              {currentStep === 2 && (
                <ParentDataStep formData={formData} onChange={handleChange} />
              )}
              {currentStep === 3 && (
                <GuardianDataStep
                  formData={formData}
                  showWali={showWali}
                  setShowWali={setShowWali}
                  onChange={handleChange}
                />
              )}

              <div className="flex justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={`flex flex-1 justify-center items-center py-3 px-4 rounded-lg font-semibold transition ${
                    currentStep === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-500 cursor-pointer"
                  }`}
                >
                  <ArrowLeft />{" "}
                  <span className="text-sm md:text-base ml-2">Sebelumnya</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex flex-1 justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition dark:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer"
                  >
                    <span className="text-sm md:text-base mr-2">
                      Selanjutnya
                    </span>{" "}
                    <ArrowRight />
                  </button>
                ) : (
                  canSubmit && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 py-3 px-4 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                        isLoading
                          ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white cursor-not-allowed dark:from-blue-600 dark:to-blue-700 shadow-lg"
                          : "bg-green-500 hover:bg-green-600 text-gray-100 dark:bg-green-600 dark:hover:bg-green-500 cursor-pointer"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm md:text-base">
                            Mengirim...
                          </span>
                        </>
                      ) : (
                        <>
                          <span>✓</span>
                          <span className="text-sm md:text-base">
                            Kirim Formulir
                          </span>
                        </>
                      )}
                    </button>
                  )
                )}
              </div>
            </form>

            <Card className="text-gray-700 dark:text-gray-300 mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold">ℹ️ Informasi Penting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Pastikan semua data yang Anda isi sudah benar dan lengkap
                </li>
                <li>
                  Data dengan tanda bintang merah (
                  <span className="text-red-500">*</span>) wajib diisi
                </li>
                <li>Simpan kartu pendaftaran untuk referensi Anda</li>
              </ul>
            </Card>
          </>
        )}
      </div>

      <LoadingModal
        isOpen={isLoading}
        status={modalStatus}
        title={
          modalStatus === "loading"
            ? "Memproses Pendaftaran"
            : modalStatus === "success"
              ? "Pendaftaran Berhasil!"
              : "Gagal Mengirim"
        }
        message={
          modalStatus === "loading"
            ? "Mohon tunggu, data Anda sedang diproses..."
            : modalStatus === "success"
              ? "Data Anda telah berhasil diterima oleh sistem"
              : error || "Terjadi kesalahan saat memproses pendaftaran"
        }
      />
    </div>
  );
}

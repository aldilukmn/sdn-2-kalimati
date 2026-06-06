"use client";

import { useEffect, useState, memo } from "react";
import RegistrationService from "@/services/registration.service";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LoadingModal from "@/app/components/LoadingModal";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  numericOnly?: boolean;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputField = memo(
  ({
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
    value,
    onChange,
    maxLength,
    numericOnly = false,
  }: InputFieldProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numericOnly) {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = numericValue;
      }
      onChange(e);
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={numericOnly ? "text" : type}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={numericOnly ? "numeric" : undefined}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
        />
      </div>
    );
  },
);

InputField.displayName = "InputField";

const SelectField = memo(
  ({
    label,
    name,
    options,
    required = false,
    value,
    onChange,
  }: SelectFieldProps) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
      >
        <option value="">-- Pilih --</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  ),
);
SelectField.displayName = "SelectField";

const TextAreaField = memo(
  ({
    label,
    name,
    required = false,
    placeholder = "",
    value,
    onChange,
  }: TextAreaFieldProps) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition resize-none"
      />
    </div>
  ),
);
TextAreaField.displayName = "TextAreaField";

export default function PpdbOnline() {
  const [formData, setFormData] = useState<RegistrationForm>({
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
  });
  const [showWali, setShowWali] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Handle nested student.address fields
      if (name.startsWith("address.")) {
        const addressField = name.replace("address.", "");
        return {
          ...prev,
          student: {
            ...prev.student,
            address: {
              ...prev.student.address,
              [addressField]: value,
            },
          },
        };
      }

      // Handle other student fields
      if (
        [
          "fullName",
          "nisn",
          "nik",
          "noKk",
          "birthPlace",
          "birthDate",
          "gender",
          "religion",
          "childOrder",
          "numberOfSiblings",
          "kindergartenOrigin",
        ].includes(name)
      ) {
        return {
          ...prev,
          student: {
            ...prev.student,
            [name]: value,
          },
        };
      }

      // Handle father fields
      if (name.startsWith("father")) {
        const fatherField = name.replace("father", "");
        const fieldName = fatherField.charAt(0).toLowerCase() + fatherField.slice(1);
        return {
          ...prev,
          father: {
            ...prev.father,
            [fieldName]: value,
          },
        };
      }

      // Handle mother fields
      if (name.startsWith("mother")) {
        const motherField = name.replace("mother", "");
        const fieldName = motherField.charAt(0).toLowerCase() + motherField.slice(1);
        return {
          ...prev,
          mother: {
            ...prev.mother,
            [fieldName]: value,
          },
        };
      }

      // Handle guardian fields
      if (name.startsWith("guardian")) {
        const guardianField = name.replace("guardian", "");
        const fieldName = guardianField.charAt(0).toLowerCase() + guardianField.slice(1);
        return {
          ...prev,
          guardian: {
            ...prev.guardian,
            [fieldName]: value,
          },
        };
      }

      // Handle other fields (like contactPhoneNumber)
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setModalStatus("loading");
    setError(null);

    try {
      const response = await RegistrationService.create(formData);
      setModalStatus("success");
      
      // Tampilkan success modal selama 2 detik sebelum redirect
      setTimeout(() => {
        alert("Pendaftaran berhasil! Terima kasih.");
        router.push("/");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar";
      setError(errorMessage);
      setModalStatus("error");
      
      // Tampilkan error modal selama 2 detik
      setTimeout(() => {
        setIsLoading(false);
        alert(`Error: ${errorMessage}`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Formulir Pendaftaran Online
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Isi semua data dengan lengkap dan benar
          </p>
        </div>

        {/* Timeline Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-start relative">
            {/* Animated Background Line */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gray-300 dark:bg-gray-700 -z-10">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-700 ease-out"
                style={{
                  width: `${((currentStep - 1) / 2) * 100}%`,
                }}
              />
            </div>

            {/* Step Circles */}
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                {/* Circle with Animation */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all duration-500 relative z-10 ${
                    step <= currentStep
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
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

                {/* Label */}
                <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Data Calon Peserta Didik */}
          {currentStep === 1 && (
            <div className="card rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                A. Data Calon Peserta Didik
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nama Lengkap"
                    name="fullName"
                    required
                    placeholder="Masukkan Nama Lengkap"
                    value={formData.student.fullName}
                    onChange={handleChange}
                  />
                  <InputField
                    label="NISN (Jika Ada)"
                    name="nisn"
                    placeholder="Nomor Induk Siswa Nasional"
                    value={formData.student.nisn}
                    onChange={handleChange}
                    numericOnly={true}
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="NIK (Nomor Induk Kependudukan)"
                    name="nik"
                    required
                    placeholder="Nomor NIK (16 digit)"
                    value={formData.student.nik}
                    onChange={handleChange}
                    maxLength={16}
                    numericOnly={true}
                  />
                  <InputField
                    label="Nomor Kartu Keluarga (KK)"
                    name="noKk"
                    required
                    placeholder="Nomor KK (16 digit)"
                    value={formData.student.noKk}
                    onChange={handleChange}
                    maxLength={16}
                    numericOnly={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Tempat Lahir"
                    name="birthPlace"
                    required
                    placeholder="Nama kota/kabupaten"
                    value={formData.student.birthPlace}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Tanggal Lahir"
                    name="birthDate"
                    type="date"
                    required
                    value={formData.student.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Jenis Kelamin"
                    name="gender"
                    required
                    options={["Laki-laki", "Perempuan"]}
                    value={formData.student.gender}
                    onChange={handleChange}
                  />
                  <SelectField
                    label="Religion"
                    name="religion"
                    required
                    options={[
                      "Islam",
                      "Kristen Protestan",
                      "Kristen Katolik",
                      "Hindu",
                      "Buddha",
                      "Konghucu",
                    ]}
                    value={formData.student.religion}
                    onChange={handleChange}
                  />
                </div>

                {/* Address Section with Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={showAddress}
                      onChange={(e) => setShowAddress(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tambahkan Alamat Lengkap
                    </span>
                  </label>

                  {showAddress && (
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <InputField
                        label="Jalan/Jl/Jln"
                        name="address.street"
                        placeholder="Nama jalan dan nomor rumah"
                        value={formData.student.address.street}
                        onChange={handleChange}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="RT"
                          name="address.rt"
                          placeholder="RT"
                          value={formData.student.address.rt}
                          onChange={handleChange}
                          maxLength={3}
                          numericOnly={true}
                        />
                        <InputField
                          label="RW"
                          name="address.rw"
                          placeholder="RW"
                          value={formData.student.address.rw}
                          onChange={handleChange}
                          maxLength={3}
                          numericOnly={true}
                        />
                        <InputField
                          label="Kode Pos"
                          name="address.postalCode"
                          placeholder="Kode Pos"
                          value={formData.student.address.postalCode}
                          onChange={handleChange}
                          maxLength={5}
                          numericOnly={true}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Kelurahan/Desa"
                          name="address.village"
                          placeholder="Kelurahan atau Desa"
                          value={formData.student.address.village}
                          onChange={handleChange}
                        />
                        <InputField
                          label="Kecamatan"
                          name="address.district"
                          placeholder="Kecamatan"
                          value={formData.student.address.district}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nomor HP Orang Tua"
                    name="contactPhoneNumber"
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={formData.contactPhoneNumber}
                    onChange={handleChange}
                    maxLength={15}
                    numericOnly={true}
                  />
                  <InputField
                    label="Anak Ke-"
                    name="childOrder"
                    required
                    placeholder="1, 2, 3, dst"
                    value={formData.student.childOrder}
                    onChange={handleChange}
                    numericOnly={true}
                    maxLength={1}
                  />
                </div>

                <InputField
                  label="Jumlah Saudara Kandung"
                  name="numberOfSiblings"
                  placeholder="Jumlah saudara kandung (isi 0 jika tidak punya saudara)"
                  value={formData.student.numberOfSiblings}
                  onChange={handleChange}
                  numericOnly={true}
                  maxLength={1}
                />

                <InputField
                  label="Asal TK/RA"
                  name="kindergartenOrigin"
                  placeholder="Nama TK/RA atau 'Tidak Ada' jika belum sekolah"
                  value={formData.student.kindergartenOrigin}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Data Orang Tua */}
          {currentStep === 2 && (
            <div className="card rounded-lg shadow-lg p-6 md:p-8 space-y-8">
              {/* Data Ayah */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                  Data Ayah
                </h2>

                <div className="space-y-6">
                  <InputField
                    label="Nama Ayah"
                    name="fatherName"
                    required
                    placeholder="Nama lengkap ayah"
                    value={formData.father.name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Tahun Lahir Ayah"
                    name="fatherBirthYear"
                    placeholder="Contoh: 1960"
                    value={formData.father.birthYear}
                    onChange={handleChange}
                    numericOnly={true}
                    maxLength={4}
                  />
                  <InputField
                    label="Pekerjaan Ayah"
                    name="fatherOccupation"
                    placeholder="Contoh: PNS, Karyawan Swasta, Petani, dll"
                    value={formData.father.occupation}
                    onChange={handleChange}
                  />
                  <InputField
                    label="NIK Ayah"
                    name="fatherNik"
                    placeholder="Nomor NIK (16 digit)"
                    value={formData.father.nik}
                    onChange={handleChange}
                    maxLength={16}
                    numericOnly={true}
                  />
                  <SelectField
                    label="Pendidikan Terakhir Ayah"
                    name="fatherEducation"
                    options={[
                      "Tidak Sekolah",
                      "SD/MI",
                      "SMP/MTs",
                      "SMA/SMK/MA",
                      "D1/D2/D3",
                      "S1",
                      "S2",
                      "S3",
                    ]}
                    value={formData.father.education}
                    onChange={handleChange}
                  />
                  <SelectField
                    label="Penghasilan Perbulan Ayah"
                    name="fatherMonthlyIncome"
                    options={[
                      "Kurang dari Rp 1.000.000",
                      "Rp 1.000.000 - Rp 2.000.000",
                      "Rp 2.000.000 - Rp 3.000.000",
                      "Rp 3.000.000 - Rp 5.000.000",
                      "Lebih dari Rp 5.000.000",
                    ]}
                    value={formData.father.monthlyIncome}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Data Ibu */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                  Data Ibu
                </h2>

                <div className="space-y-6">
                  <InputField
                    label="Nama Ibu"
                    name="motherName"
                    required
                    placeholder="Nama lengkap ibu"
                    value={formData.mother.name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Tahun Lahir Ibu"
                    name="motherBirthYear"
                    placeholder="Contoh: 1965"
                    value={formData.mother.birthYear}
                    onChange={handleChange}
                    numericOnly={true}
                    maxLength={4}
                  />
                  <InputField
                    label="Pekerjaan Ibu"
                    name="motherOccupation"
                    placeholder="Contoh: PNS, Karyawan Swasta, Ibu Rumah Tangga, dll"
                    value={formData.mother.occupation}
                    onChange={handleChange}
                  />
                  <InputField
                    label="NIK Ibu"
                    name="motherNik"
                    placeholder="Nomor NIK (16 digit)"
                    value={formData.mother.nik}
                    onChange={handleChange}
                    maxLength={16}
                    numericOnly={true}
                  />
                  <SelectField
                    label="Pendidikan Terakhir Ibu"
                    name="motherEducation"
                    options={[
                      "Tidak Sekolah",
                      "SD/MI",
                      "SMP/MTs",
                      "SMA/SMK/MA",
                      "D1/D2/D3",
                      "S1",
                      "S2",
                      "S3",
                    ]}
                    value={formData.mother.education}
                    onChange={handleChange}
                  />
                  <SelectField
                    label="Penghasilan Perbulan Ibu"
                    name="motherMonthlyIncome"
                    options={[
                      "Kurang dari Rp 1.000.000",
                      "Rp 1.000.000 - Rp 2.000.000",
                      "Rp 2.000.000 - Rp 3.000.000",
                      "Rp 3.000.000 - Rp 5.000.000",
                      "Lebih dari Rp 5.000.000",
                    ]}
                    value={formData.mother.monthlyIncome}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Data Wali */}
          {currentStep === 3 && (
            <div className="card rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                C. Data Wali (Jika Ada)
              </h2>

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWali}
                    onChange={(e) => setShowWali(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Saya memiliki wali (jika tidak ada, abaikan bagian ini)
                  </span>
                </label>
              </div>

              {showWali && (
                <div className="space-y-6 p-6 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <InputField
                    label="Nama Wali"
                    name="guardianName"
                    placeholder="Nama lengkap wali"
                    value={formData.guardian.name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Hubungan dengan Anak"
                    name="guardianRelationship"
                    placeholder="Contoh: Kakek, Nenek, Paman, Bibi, dll"
                    value={formData.guardian.relationship}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Nomor HP Wali"
                    name="guardianPhoneNumber"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.guardian.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`flex flex-1 justify-center items-center py-3 px-4 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                  : "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
            >
              <ArrowLeft /> <span className="ml-2">Sebelumnya</span>
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex flex-1 justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <span className="mr-2">Selanjutnya</span> <ArrowRight />
              </button>
            ) : (
              canSubmit && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white cursor-not-allowed dark:from-blue-600 dark:to-blue-700 shadow-lg"
                      : "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Kirim Formulir</span>
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 p-4 card rounded-lg text-sm text-blue-900 dark:text-blue-100">
          <p className="font-semibold mb-2">ℹ️ Informasi Penting:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Pastikan semua data yang Anda isi sudah benar dan lengkap</li>
            <li>
              Data dengan tanda bintang merah (
              <span className="text-red-500">*</span>) wajib diisi
            </li>
            <li>Simpan bukti konfirmasi pendaftaran untuk referensi Anda</li>
          </ul>
        </div>
      </div>

      {/* Loading Modal */}
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

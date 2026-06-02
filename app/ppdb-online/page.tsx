"use client";

import { useEffect, useState } from "react";

interface FormData {
  // Data Calon Peserta Didik
  namaLengkap: string;
  nisn: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  alamatLengkap: string;
  nomorHpOrangTua: string;
  anakKe: string;
  asalTkRa: string;

  // Data Ayah
  namaAyah: string;
  pekerjaanAyah: string;
  pendidikanAyah: string;
  penghasilanAyah: string;

  // Data Ibu
  namaIbu: string;
  pekerjaanIbu: string;
  pendidikanIbu: string;
  penghasilanIbu: string;

  // Kontak
  nomorHpKontak: string;

  // Data Wali
  namaWali: string;
  hubunganWali: string;
  nomorHpWali: string;
}

export default function PpdbOnline() {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    nisn: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    alamatLengkap: "",
    nomorHpOrangTua: "",
    anakKe: "",
    asalTkRa: "",
    namaAyah: "",
    pekerjaanAyah: "",
    pendidikanAyah: "",
    penghasilanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    pendidikanIbu: "",
    penghasilanIbu: "",
    nomorHpKontak: "",
    namaWali: "",
    hubunganWali: "",
    nomorHpWali: "",
  });

  const [showWali, setShowWali] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.count("SUBMIT");

    alert("TES");
  };

  const InputField = ({
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
      />
    </div>
  );

  const SelectField = ({
    label,
    name,
    options,
    required = false,
  }: {
    label: string;
    name: keyof FormData;
    options: string[];
    required?: boolean;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
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
  );

  const TextAreaField = ({
    label,
    name,
    required = false,
    placeholder = "",
  }: {
    label: string;
    name: keyof FormData;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition resize-none"
      />
    </div>
  );

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
                    name="namaLengkap"
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                  <InputField
                    label="NISN (Jika Ada)"
                    name="nisn"
                    placeholder="Nomor Induk Siswa Nasional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Tempat Lahir"
                    name="tempatLahir"
                    required
                    placeholder="Nama kota/kabupaten"
                  />
                  <InputField
                    label="Tanggal Lahir"
                    name="tanggalLahir"
                    type="date"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Jenis Kelamin"
                    name="jenisKelamin"
                    required
                    options={["Laki-laki", "Perempuan"]}
                  />
                  <SelectField
                    label="Agama"
                    name="agama"
                    required
                    options={[
                      "Islam",
                      "Kristen Protestan",
                      "Kristen Katolik",
                      "Hindu",
                      "Buddha",
                      "Konghucu",
                    ]}
                  />
                </div>

                <TextAreaField
                  label="Alamat Lengkap"
                  name="alamatLengkap"
                  required
                  placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kabupaten, provinsi"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nomor HP Orang Tua"
                    name="nomorHpOrangTua"
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                  />
                  <InputField
                    label="Anak Ke-"
                    name="anakKe"
                    type="number"
                    required
                    placeholder="1"
                  />
                </div>

                <InputField
                  label="Asal TK/RA"
                  name="asalTkRa"
                  placeholder="Nama TK/RA atau 'Tidak Ada' jika belum sekolah"
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
                  B.1 Data Ayah
                </h2>

                <div className="space-y-6">
                  <InputField
                    label="Nama Ayah"
                    name="namaAyah"
                    required
                    placeholder="Nama lengkap ayah"
                  />
                  <InputField
                    label="Pekerjaan Ayah"
                    name="pekerjaanAyah"
                    placeholder="Contoh: PNS, Karyawan Swasta, Petani, dll"
                  />
                  <SelectField
                    label="Pendidikan Terakhir Ayah"
                    name="pendidikanAyah"
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
                  />
                  <SelectField
                    label="Penghasilan Perbulan Ayah"
                    name="penghasilanAyah"
                    options={[
                      "Kurang dari Rp 1.000.000",
                      "Rp 1.000.000 - Rp 2.000.000",
                      "Rp 2.000.000 - Rp 3.000.000",
                      "Rp 3.000.000 - Rp 5.000.000",
                      "Lebih dari Rp 5.000.000",
                    ]}
                  />
                </div>
              </div>

              {/* Data Ibu */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                  B.2 Data Ibu
                </h2>

                <div className="space-y-6">
                  <InputField
                    label="Nama Ibu"
                    name="namaIbu"
                    required
                    placeholder="Nama lengkap ibu"
                  />
                  <InputField
                    label="Pekerjaan Ibu"
                    name="pekerjaanIbu"
                    placeholder="Contoh: PNS, Karyawan Swasta, Ibu Rumah Tangga, dll"
                  />
                  <SelectField
                    label="Pendidikan Terakhir Ibu"
                    name="pendidikanIbu"
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
                  />
                  <SelectField
                    label="Penghasilan Perbulan Ibu"
                    name="penghasilanIbu"
                    options={[
                      "Kurang dari Rp 1.000.000",
                      "Rp 1.000.000 - Rp 2.000.000",
                      "Rp 2.000.000 - Rp 3.000.000",
                      "Rp 3.000.000 - Rp 5.000.000",
                      "Lebih dari Rp 5.000.000",
                    ]}
                  />
                </div>
              </div>

              {/* Kontak */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b-2 border-blue-600">
                  B.3 Kontak
                </h2>

                <InputField
                  label="Nomor HP yang Dapat Dihubungi"
                  name="nomorHpKontak"
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                />
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
                    name="namaWali"
                    placeholder="Nama lengkap wali"
                  />
                  <InputField
                    label="Hubungan dengan Anak"
                    name="hubunganWali"
                    placeholder="Contoh: Kakek, Nenek, Paman, Bibi, dll"
                  />
                  <InputField
                    label="Nomor HP Wali"
                    name="nomorHpWali"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
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
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                  : "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
            >
              ← Sebelumnya
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Selanjutnya →
              </button>
            ) : (
              canSubmit && (
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition dark:bg-green-700 dark:hover:bg-green-600"
                >
                  ✓ Kirim Formulir
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
    </div>
  );
}

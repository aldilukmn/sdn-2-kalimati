"use client";

import { Search, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { dataTKA, getGrade } from "./data";
import DataField from "@/components/common/DataField";
import BackButton from "@/components/common/BackButton";
import { Card } from "@/components/ui/card";

export default function HasilTKA() {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cekHasil = async () => {
    setError("");
    setHasil(null);
    setIsLoading(true);

    // Simulasi loading delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const siswa = dataTKA.find((item) =>
      item.nama.toLowerCase().includes(nama.toLowerCase()),
    );

    setIsLoading(false);

    if (siswa) {
      setHasil(siswa);
    } else {
      setError("Data tidak ditemukan");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:gap-10 px-5 py-7 xl:py-10">
      <BackButton />
      <Card
        className="
        mt-10
        w-full
        max-w-md
        text-center
      "
      >
        <div className="text-4xl md:text-6xl">📝</div>

        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
          Hasil TKA
        </h1>

        <p className="text-sm md:text-base opacity-70 mb-3 text-gray-600 dark:text-gray-300">
          Masukkan nama untuk melihat hasil tes
        </p>

        {/* Input */}
        {/* <div className="flex items-center rounded-md bg-white pl-3 outline-1-outline-offset-1 mb-4 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600 dark:outline-gray-600 dark:focus-within:outline-blue-600 dark:bg-gray-800"> */}
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && nama && !isLoading) {
              cekHasil();
            }
          }}
          type="text"
          placeholder="Masukkan Nama Kamu"
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
          }}
          id="color-placeholder"
          className="
            w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30
          "
        />
        {/* </div> */}
        <button
          onClick={cekHasil}
          disabled={!nama || isLoading}
          className="
              glow-button
              w-full
              py-3
              flex
              items-center
              justify-center
              gap-2
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search size={18} />
              Cek Hasil
            </>
          )}
        </button>

        {/* Tombol cek */}

        {/* Loading */}
        {isLoading && (
          <div
            className="
            mt-5
            rounded-2xl
            bg-blue-500/15
            border border-blue-500/20
            p-4
            gap-2
            flex
            items-center
            justify-center
            animate-pulse
          "
          >
            <Loader size={18} className="animate-spin" />
            <p>Mencari data siswa...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="
            mt-5
            rounded-2xl
            bg-red-500/15
            border border-red-500/20
            p-4
            gap-2
            flex
            items-center
            justify-center
          "
          >
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* Hasil */}
        {hasil && (
          <div
            className="
              mt-6
              rounded-3xl
              border border-blue-400/30
              bg-gradient-to-br
              from-blue-500/10
              to-cyan-500/5
              p-6
              text-left
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(59,130,246,0.15)]
              animate-in
              fade-in
              zoom-in-95
              duration-300
            "
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-blue-500/20
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                📊
              </div>

              <div>
                <h2 className="text-lg md:text-2xl font-bold text-blue-400">
                  Data Hasil Tes
                </h2>
              </div>
            </div>

            {/* Data */}
            <div className="space-y-4">
              <div className="space-y-4">
                <DataField label="Nomor Peserta" value={hasil.nomorPeserta} />

                <DataField label="NISN" value={hasil.nisn} />

                <DataField label="Nama Lengkap" value={hasil.nama} />

                <DataField
                  label="Nilai Matematika"
                  value={hasil.nilaiMatematika}
                  grade={getGrade(hasil.nilaiMatematika)}
                />

                <DataField
                  label="Nilai Bahasa Indonesia"
                  value={hasil.nilaiBahasaIndonesia}
                  grade={getGrade(hasil.nilaiBahasaIndonesia)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

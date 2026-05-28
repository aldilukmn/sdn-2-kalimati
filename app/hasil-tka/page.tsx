"use client";

import Link from "next/link";
import { ArrowBigLeft, Search, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { dataTKA, getGrade } from "./data";
import DataField from '../components/DataField';

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
    <div className="flex flex-col items-center justify-center gap-5 md:gap-10 px-5 my-5 xl:my-8">
      <Link
        href="/"
        className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <button className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-800/50 border-blue-500/50">
          <ArrowBigLeft size={18} />
          <span className="text-xs md:text-sm">Kembali</span>
        </button>
      </Link>

      <div
        className="
        card
        w-full
        max-w-md
        text-center
      "
      >
        <div className="text-4xl md:text-6xl mb-5">📝</div>

        <h1 className="text-2xl md:text-3xl font-bold">Hasil TKA</h1>

        <p className="text-sm md:text-base opacity-70 mt-2 mb-8">
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
          className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-white/10
            outline-1
            mb-4
            outline-gray-600
            focus:outline-blue-500
            dark:outline-gray-600
            dark:focus:outline-blue-500
            dark:bg-gray-800
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
                  Hasil Tes Kemampuan Akademik
                </h2>

                <p className="text-sm md:text-base opacity-70">
                  Data Hasil Ujian
                </p>
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
      </div>
    </div>
  );
}

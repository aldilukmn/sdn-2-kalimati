"use client";

import Link from "next/link";
import { ArrowBigLeft, Search, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { dataKelulusan } from "./data";
import confetti from "canvas-confetti";

export default function Kelulusan() {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const siswa = dataKelulusan.find((item) =>
    item.nama.toLowerCase().includes(nama.toLowerCase()),
  );

  const cekKelulusan = async () => {
    setError("");
    setHasil(null);
    setIsLoading(true);

    // Simulasi loading delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);

    if (siswa) {
      setHasil(siswa);
      confetti({
        particleCount: 150,
        spread: 120,
        startVelocity: 40,
        scalar: 1.2,
        ticks: 200,
        origin: {
          x: 0.5,
          y: 0.6,
        },
      });
    } else {
      setError("Data tidak ditemukan");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:gap-10 px-5 my-5 xl:my-10">
      {/* Tombol kembali */}
      <Link
        href="/"
        className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <button className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-800/50 border-blue-500/50">
          <ArrowBigLeft size={18} />
          <span className="text-xs md:text-sm">Kembali</span>
        </button>
      </Link>

      {/* Card utama */}
      <div
        className="
        card
        w-full
        max-w-md
        text-center
      "
      >
        <div className="text-6xl mb-5">🎓</div>

        <h1 className="text-3xl font-bold">Cek Kelulusan</h1>

        <p className="opacity-70 mt-2 mb-8">
          Masukkan NISN untuk melihat hasil kelulusan
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Masukkan Nama Kamu"
          maxLength={10}
          value={nama}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z]/g, "");
            setNama(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && nama && !isLoading) {
              cekKelulusan();
            }
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

        {/* Tombol cek */}
        <button
          onClick={cekKelulusan}
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
              Cek Kelulusan
            </>
          )}
        </button>

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
            <p>Mencari data Anda...</p>
          </div>
        )}

        {/* Hasil */}
        {hasil && (
          <div
            className="
              mt-6
              rounded-3xl
              border border-green-400/20
              bg-gradient-to-br
              from-green-500/10
              to-emerald-500/5
              p-6
              text-left
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(34,197,94,0.15)]
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
                  bg-green-500/20
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                🎓
              </div>

              <div>
                <h2 className="text-2xl font-bold text-green-400">
                  {hasil.status}
                </h2>

                <p className="text-sm opacity-70">
                  Selamat atas kelulusan Anda
                </p>
              </div>
            </div>

            {/* Data */}
            <div className="space-y-4">
              <div
                className="
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  p-4
                "
              >
                <p className="text-sm opacity-60 mb-1">Nomor Peserta</p>

                <h3 className="font-semibold text-lg">{hasil.nomorPeserta}</h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  p-4
                "
              >
                <p className="text-sm opacity-60 mb-1">Nama Lengkap</p>

                <h3 className="font-semibold text-lg">{hasil.nama}</h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  p-4
                "
              >
                <p className="text-sm opacity-60 mb-1">NISN</p>

                <h3 className="font-semibold text-lg">{hasil.nisn}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

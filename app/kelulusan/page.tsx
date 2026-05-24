"use client";

import Link from "next/link";
import { ArrowBigLeft, Search } from "lucide-react";
import { useState } from "react";
import { dataKelulusan } from "./data";

export default function Kelulusan() {

  const [nisn, setNisn] = useState("");
  const [hasil, setHasil] = useState<any>(null);
  const [error, setError] = useState("");

  const cekKelulusan = () => {

    setError("");
    setHasil(null);

    const siswa = dataKelulusan.find(
      (item) => item.nisn === nisn
    );

    if (siswa) {
      setHasil(siswa);
    } else {
      setError("Data tidak ditemukan");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:gap-10 px-5 my-5 xl:my-10">

      {/* Tombol kembali */}
      <Link
        href="/"
        className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <button className="back-button text-sm">
          <ArrowBigLeft size={18} />
          <span className="text-xs md:text-sm">
            Kembali
          </span>
        </button>
      </Link>

      {/* Card utama */}
      <div className="
        card
        w-full
        max-w-md
        text-center
      ">

        <div className="text-6xl mb-5">
          🎓
        </div>

        <h1 className="text-3xl font-bold">
          Cek Kelulusan
        </h1>

        <p className="opacity-70 mt-2 mb-8">
          Masukkan NISN untuk melihat hasil kelulusan
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Masukkan NISN"
          maxLength={10}
          value={nisn}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setNisn(value);
        }}
          className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-white/10
            border border-white/10
            outline-none
            mb-4
          "
        />

        {/* Tombol cek */}
        <button
          onClick={cekKelulusan}
          className="
            glow-button
            w-full
            py-3
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Search size={18} />
          Cek Kelulusan
        </button>

        {/* Error */}
        {error && (
          <div className="
            mt-5
            rounded-2xl
            bg-red-500/15
            border border-red-500/20
            p-4
          ">
            {error}
          </div>
        )}

        {/* Hasil */}
        {hasil && (
          <div className="
            mt-5
            rounded-2xl
            bg-green-500/15
            border border-green-500/20
            p-5
            text-left
          ">

            <h2 className="text-xl font-bold mb-4">
              ✅ {hasil.status}
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Nomor Peserta:</strong> {hasil.nomorPeserta}
              </p>
              <p>
                <strong>Nama:</strong> {hasil.nama}
              </p>
              <p>
                <strong>NISN:</strong> {hasil.nisn}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
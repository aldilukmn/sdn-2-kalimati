"use client";

import React from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface GraduationCountdownModalProps {
  show: boolean;
  countdown: Countdown;
  onClose: () => void;
  announcementDate: string;
}

export default function GraduationCountdownModal({
  show,
  countdown,
  onClose,
  announcementDate,
}: GraduationCountdownModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-300 to-orange-300 dark:from-amber-700 dark:via-yellow-600 dark:to-orange-600 p-10 max-w-sm md:max-w-lg text-center shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-yellow-200 dark:border-yellow-500 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-200 dark:bg-yellow-500 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-200 dark:bg-orange-500 rounded-full opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        <div className="relative z-10">
          <div
            className="text-5xl mb-6 animate-bounce"
            style={{ animationDuration: "1s" }}
          >
            ⏳
          </div>

          <h2 className="text-lg md:text-2xl font-bold text-amber-900 dark:text-white mb-2">
            Pengumuman Kelulusan
          </h2>

          <p className="text-sm md:text-base text-amber-800 dark:text-yellow-50 mb-8 leading-relaxed">
            Hasil kelulusan akan segera diumumkan. Silahkan kembali lagi nanti.
            Terima kasih atas kesabaranmu. 😊
          </p>

          <div className="bg-white/40 dark:bg-black/30 rounded-2xl p-6 mb-8  border-2 border-yellow-100 dark:border-yellow-400/50">
            <p className="text-xs md:text-sm font-semibold text-amber-900 dark:text-yellow-100 mb-4 uppercase tracking-widest">
              Waktu Mundur
            </p>
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-red-300 to-red-400 dark:from-red-600 dark:to-red-700 rounded-xl p-3 md:p-4 shadow-lg">
                <div className="text-xl md:text-2xl font-black text-white">
                  {countdown.days.toString().padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm font-bold text-red-100 uppercase mt-1">
                  Hari
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700 rounded-xl p-3 md:p-4 shadow-lg">
                <div className="text-xl md:text-2xl font-black text-white">
                  {countdown.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm font-bold text-orange-100 uppercase mt-1">
                  Jam
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-700 rounded-xl p-3 md:p-4 shadow-lg">
                <div className="text-xl md:text-2xl font-black text-white">
                  {countdown.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm font-bold text-yellow-100 uppercase mt-1">
                  Menit
                </div>
              </div>

              <div className="bg-gradient-to-br from-lime-300 to-lime-400 dark:from-lime-600 dark:to-lime-700 rounded-xl p-3 md:p-4 shadow-lg">
                <div className="text-xl md:text-2xl font-black text-white">
                  {countdown.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm font-bold text-lime-100 uppercase mt-1">
                  Detik
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-amber-800 dark:text-yellow-100 mb-6 font-semibold">
            📅 {announcementDate}
          </p>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white dark:from-yellow-700 dark:to-amber-700 dark:hover:from-yellow-800 dark:hover:to-amber-800 px-8 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transform text-sm md:text-base"
          >
            ✓ Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

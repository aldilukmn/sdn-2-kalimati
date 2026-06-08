"use client";

import Link from "next/link";
import TextType from "./reactbits/Text-Type/TextType";
import { useState, useEffect } from "react";

const buttonClassName =
  "cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-900 font-semibold md:tracking-widest border-blue-500/50 dark:border-blue-800/50";

const navigationLinks = [
  { href: "/kelulusan", label: "Cek Kelulusan", disabled: true },
  { href: "/hasil-tka", label: "Cek Hasil TKA", disabled: false },
  // { href: "/login", label: "Login", disabled: false },
  { href: "/spmb-online", label: "SPMB Online", disabled: false },
];

// Tanggal dan jam kelulusan: 02 Juni 2026 jam 9 pagi
const GRADUATION_ANNOUNCEMENT_DATE = new Date(Date.UTC(2026, 5, 2, 5, 0, 0)); // 12:00 WIB = 05:00 UTC

export default function Menu() {
  const [showNotif, setShowNotif] = useState(false);
  const [isGraduationButtonEnabled, setIsGraduationButtonEnabled] =
    useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Cek apakah waktu saat ini sudah mencapai waktu pengumuman kelulusan
  useEffect(() => {
    const checkGraduationTime = () => {
      const now = new Date();
      if (now >= GRADUATION_ANNOUNCEMENT_DATE) {
        setIsGraduationButtonEnabled(true);
      } else {
        setIsGraduationButtonEnabled(false);
      }
    };

    // Hitung countdown
    const calculateCountdown = () => {
      const now = new Date();
      const diff = GRADUATION_ANNOUNCEMENT_DATE.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Cek saat pertama kali component di-render
    checkGraduationTime();
    calculateCountdown();

    // Cek setiap detik untuk memastikan tombol langsung aktif saat waktu tiba
    const interval = setInterval(() => {
      checkGraduationTime();
      calculateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleKelulusanClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 10000);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 relative">
      <img
        src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
        alt="logo-sekolah"
        className="lg:max-w-[20%] max-w-[35%] h-auto"
      />
      <h1 className="xl:text-5xl lg:text-3xl text-2xl font-bold md:tracking-widest">
        <TextType
          text={[
            "Selamat Datang di",
            "UPTD SD Negeri 2 Kalimati",
            "Kecamatan Jatibarang",
          ]}
          typingSpeed={75}
          pauseDuration={700}
          showCursor={true}
          cursorCharacter="|"
        />
      </h1>
      {/* <div className='card grid md:grid-cols-6 grid-cols-3 px-5 py-4 gap-5 rounded-lg shadow-lg items-center lg:text-lg font-medium'> */}
      {/* <div className='card flex px-5 py-4 gap-5 rounded-lg shadow-lg items-center lg:text-lg font-medium'> */}
      {/* {
          kelas.map((item) => (
            <Link key={item.href} href={item.href} className='class-card'>{item.label}</Link>
          ))
        } */}
      <div
        className="card max-w-lg grid md:grid-cols-2 grid-cols-2 gap-5 py-10 items-center text-sm md:text-base text-center"
        style={
          {
            "--card-padding": "20px",
          } as React.CSSProperties
        }
      >
        {navigationLinks.map((link) => {
          // Gunakan state isGraduationButtonEnabled untuk tombol kelulusan
          const isDisabled =
            link.href === "/kelulusan"
              ? !isGraduationButtonEnabled
              : link.disabled;

          return isDisabled ? (
            <button
              key={link.href}
              onClick={handleKelulusanClick}
              className={`${buttonClassName}`}
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={`${buttonClassName}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Notifikasi - Full Screen Modal */}
      {showNotif && (
        <div
          className="
          fixed
          inset-0
          bg-black/60
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-50
          animate-in
          fade-in
          duration-300
        "
        >
          <div
            className="
            rounded-3xl
            bg-gradient-to-br
            from-amber-300
            via-yellow-300
            to-orange-300
            dark:from-amber-700
            dark:via-yellow-600
            dark:to-orange-600
            p-10
            max-w-sm
            md:max-w-lg
            text-center
            shadow-2xl
            animate-in
            zoom-in-95
            duration-300
            border-4
            border-yellow-200
            dark:border-yellow-500
            relative
            overflow-hidden
          "
          >
            {/* Animated background elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-200 dark:bg-yellow-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-200 dark:bg-orange-500 rounded-full opacity-30 blur-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>

            <div className="relative z-10">
              {/* Icon with pulse animation */}
              <div
                className="text-5xl mb-6 animate-bounce"
                style={{ animationDuration: "1s" }}
              >
                ⏳
              </div>

              <h2 className="text-lg md:text-2xl font-bold text-amber-900 dark:text-white mb-2">
                Pengumuman Kelulusan
              </h2>

              <p className="text-sm md:text-base   text-amber-800 dark:text-yellow-50 mb-8 leading-relaxed">
                Hasil kelulusan akan segera diumumkan. Silahkan kembali lagi
                nanti. Terima kasih atas kesabaranmu. 😊
              </p>

              {/* Countdown Timer */}
              <div className="bg-white/40 dark:bg-black/30 rounded-2xl p-6 mb-8 backdrop-blur-sm border-2 border-yellow-100 dark:border-yellow-400/50">
                <p className="text-xs md:text-sm font-semibold text-amber-900 dark:text-yellow-100 mb-4 uppercase tracking-widest">
                  Waktu Mundur
                </p>
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {/* Days */}
                  <div className="bg-gradient-to-br from-red-300 to-red-400 dark:from-red-600 dark:to-red-700 rounded-xl p-3 md:p-4 shadow-lg">
                    <div className="text-xl md:text-2xl font-black text-white">
                      {countdown.days.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-red-100 uppercase mt-1">
                      Hari
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700 rounded-xl p-3 md:p-4 shadow-lg">
                    <div className="text-xl md:text-2xl font-black text-white">
                      {countdown.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-orange-100 uppercase mt-1">
                      Jam
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-700 rounded-xl p-3 md:p-4 shadow-lg">
                    <div className="text-xl md:text-2xl font-black text-white">
                      {countdown.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-yellow-100 uppercase mt-1">
                      Menit
                    </div>
                  </div>

                  {/* Seconds */}
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

              {/* Tanggal pengumuman */}
              <p className="text-xs md:text-sm text-amber-800 dark:text-yellow-100 mb-6 font-semibold">
                📅 Selasa, 2 Juni 2026 - Pukul 12:00 WIB
              </p>

              <button
                onClick={() => setShowNotif(false)}
                className="
                bg-gradient-to-r
                from-yellow-500
                to-amber-500
                hover:from-yellow-600
                hover:to-amber-600
                text-white
                dark:from-yellow-700
                dark:to-amber-700
                dark:hover:from-yellow-800
                dark:hover:to-amber-800
                px-8
                py-3
                rounded-xl
                font-bold
                transition-all
                duration-200
                cursor-pointer
                shadow-lg
                hover:shadow-xl
                hover:scale-105
                transform
                text-sm md:text-base
              "
              >
                ✓ Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

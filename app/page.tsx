"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GraduationCap, FileText, UserPlus } from "lucide-react";
import TextType from "./reactbits/Text-Type/TextType";
import GraduationCountdownModal from "./components/GraduationCountdownModal";

const buttonClassName =
  "cursor-pointer flex flex-col md:flex-row items-center justify-center gap-2 border border-blue-700 px-7 py-3 rounded-lg bg-blue-700 text-white text-md md:text-lg font-semibold md:tracking-wide duration-300 hover:bg-blue-800 hover:border-blue-800";

const navigationLinks = [
  { href: "/kelulusan", label: "Cek Kelulusan", disabled: true, icon: GraduationCap },
  { href: "/hasil-tka", label: "Cek Hasil TKA", disabled: false, icon: FileText },
  { href: "/spmb", label: "Daftar SPMB", disabled: false, icon: UserPlus },
];

const GRADUATION_ANNOUNCEMENT_DATE = new Date(Date.UTC(2026, 5, 2, 5, 0, 0)); // 12:00 WIB = 05:00 UTC

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Menu() {
  const [showNotif, setShowNotif] = useState(false);
  const [isGraduationButtonEnabled, setIsGraduationButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = GRADUATION_ANNOUNCEMENT_DATE.getTime() - now.getTime();

      if (now >= GRADUATION_ANNOUNCEMENT_DATE) {
        setIsGraduationButtonEnabled(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsGraduationButtonEnabled(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

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
        className="md:max-w-[20%] max-w-[30%] h-auto"
      />
      <h1 className="xl:text-7xl lg:text-5xl text-3xl font-bold md:tracking-widest">
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
      <div
        className="grid md:grid-cols-3 grid-cols-2 gap-5 md:py-10 items-center text-sm md:text-base text-center mx-5 md:mx-0"
        style={{ "--card-padding": "20px" } as React.CSSProperties}
      >
        {navigationLinks.map((link) => {
          const isDisabled = link.href === "/kelulusan" ? !isGraduationButtonEnabled : link.disabled;
          const Icon = link.icon;

          return isDisabled ? (
            <button
              key={link.href}
              onClick={handleKelulusanClick}
              className={buttonClassName}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </button>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={`${buttonClassName} shadow-md`}
            >
              <Icon size={25} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <GraduationCountdownModal
        show={showNotif}
        countdown={countdown}
        onClose={() => setShowNotif(false)}
        announcementDate="Selasa, 2 Juni 2026 - Pukul 12:00 WIB"
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import TextType from "./reactbits/Text-Type/TextType";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { kelas } from "./data/kelas";

const buttonClassName =
  "cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 duration-300 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-900 font-semibold tracking-widest border-blue-500/50 dark:border-blue-800/50";

const navigationLinks = [
  { href: "/kelulusan", label: "Cek Kelulusan", disabled: true },
  { href: "/hasil-tka", label: "Cek Hasil TKA", disabled: false },
];

export default function Menu() {
  const [showNotif, setShowNotif] = useState(false);

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
      <h1 className="xl:text-7xl lg:text-5xl md:text-3xl text-2xl font-bold md:tracking-widest">
        <TextType
          text={[
            "Selamat Datang di",
            "UPTD SD Negeri 2 Kalimati",
            "Kecamatan Jatibarang",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
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
      <div className="card max-w-md flex justify-around gap-5 py-10 items-center text-sm md:text-base">
        {navigationLinks.map((link) =>
          link.disabled ? (
            <button
              key={link.href}
              onClick={handleKelulusanClick}
              className={`${buttonClassName}`}
            >
              {link.label}
            </button>
          ) : (
            <Link key={link.href} href={link.href} className={buttonClassName}>
              {link.label}
            </Link>
          ),
        )}
      </div>

      {/* Notifikasi - Full Screen Modal */}
      {showNotif && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
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
            bg-yellow-400
            dark:bg-yellow-600
            p-8
            max-w-sm
            text-center
            shadow-2xl
            animate-in
            zoom-in-95
            duration-300
          "
          >
            <div className="text-5xl mb-4">⏳</div>

            <h2 className="text-2xl font-bold text-yellow-900 dark:text-white mb-3">
              Pengumuman Kelulusan
            </h2>

            <p className="text-sm text-yellow-800 dark:text-yellow-50 mb-6 leading-relaxed">
              Hasil kelulusan akan segera diumumkan. Silahkan kembali lagi
              nanti. Terima kasih atas kesabaranmu.
            </p>

            <button
              onClick={() => setShowNotif(false)}
              className="
              bg-yellow-500
              hover:bg-yellow-600
              text-white
              dark:bg-yellow-700
              dark:hover:bg-yellow-800
              px-6
              py-2
              rounded-lg
              font-semibold
              transition-colors
              duration-200
              cursor-pointer
            "
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

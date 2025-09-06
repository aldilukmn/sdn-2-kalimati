import Link from "next/link";
import JumlahMurid from "./structure/jumlah-murid";
import NamaMurid from "./structure/nama-murid";
import WaliKelas from "./structure/wali-kelas";

const menuItems = [
  { href: "/kelas-5/jadwal-pelajaran", label: "Jadwal Pelajaran" },
  { href: "/kelas-5/piket-kelas", label: "Piket Kelas" },
  { href: "/kelas-5/struktur-organisasi", label: "Struktur Organisasi" },
];

export default function Kelas5({}) {
  return (
    <div className="flex flex-col md:mx-20 mx-5 min-h-screen">
      <div className="flex w-full my-10 items-center justify-between gap-10">
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm md:text-base"
        >
          <span className="font-semibold">&lt;</span> Kembali
        </Link>
        <div className="flex-1 flex justify-center">
          <h2 className="md:w-fit w-full lg:text-2xl md:text-xl font-semibold tracking-wide shadow-md bg-white py-2 md:py-3 px-5 rounded-lg text-center">
            Selamat Datang di Kelas 5
          </h2>
        </div>
      </div>
      <div className="w-full flex flex-wrap gap-10">
        <WaliKelas/>
        <JumlahMurid />
        <div className="flex flex-col justify-between gap-5 w-full lg:w-fit">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg transition-all duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 shadow-md hover:bg-blue-600 md:text-lg"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-lg shadow-lg bg-white p-6 my-10">
        <NamaMurid />
      </div>
    </div>
  );
}
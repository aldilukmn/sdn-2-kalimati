import Link from "next/link";
import JumlahMurid from "./structure/jumlah-murid";
import NamaMurid from "./structure/nama-murid";

export default function Kelas5({}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col h-32 flex-none items-center">
        <h1 className="text-2xl font-semibold mb-4 tracking-wide">Selamat Datang di Kelas 5</h1>
      </div>
      <div className="rounded-lg shadow-lg bg-white p-6 my-6">
        <NamaMurid />
        <JumlahMurid />
      </div>
      <div className="w-full flex justify-center mt-auto ">
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Kembali ke Menu
        </Link>
      </div>
    </div>
  );
}
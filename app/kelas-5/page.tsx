import Link from "next/link";
import JumlahMurid from "./structure/jumlah-murid";
import NamaMurid from "./structure/nama-murid";
import WaliKelas from "./structure/wali-kelas";

export default function Kelas5({}) {
  return (
    <div className="flex flex-col mx-20 min-h-screen">
      <div className="md:w-fit w-full m-10 place-self-center">
        <h2 className="text-2xl font-semibold tracking-wide shadow-md bg-white py-3 px-5 rounded-lg">Selamat Datang di Kelas 5</h2>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-4">
        <WaliKelas/>
        <JumlahMurid />
      </div>
      <div className="rounded-lg shadow-lg bg-white p-6 my-6">
        <NamaMurid />
      </div>
      <div className="fixed top-5 left-5">
        <Link
          href="/"
          className="bg-blue-300 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          <span className="font-semibold">&lt;</span> Kembali
        </Link>
      </div>
    </div>
  );
}
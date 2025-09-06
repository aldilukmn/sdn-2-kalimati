import Link from "next/link";

export default function StrukturOrganisasi() {
  return (
    <div className="flex flex-col md:mx-20 mx-5 min-h-screen">
      <div className="md:w-fit w-full m-10 place-self-center">
        <h2 className="text-2xl font-semibold tracking-wide shadow-md bg-white py-3 px-5 rounded-lg">Struktur Organisasi Kelas 5</h2>
      </div>
      <div className="w-full flex flex-wrap gap-4">
        <p>Struktur organisasi akan segera hadir di halaman ini. Mohon bersabar dan cek kembali nanti!</p>
      </div>
      <div className="absolute top-10">
        <Link
          href="/kelas-5"
          className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          <span className="font-semibold">&lt;</span> Kembali
        </Link>
      </div>
    </div>
  );
}
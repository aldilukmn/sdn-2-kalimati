import Link from "next/link";

const jadwalPiket = [
  { hari: "Senin", nama: ["Amelia Putri Purwanto", "Saiful Bahri", "Widiasih"] },
  { hari: "Selasa", nama: ["Abyan Bagas Pradipta", "Waina Maulana", "Nadia Safwatul Rolisa"] },
  { hari: "Rabu", nama: ["Desi Wulan Dari", "Celena Claudiah Anggita Putri", "Sapta Maulana", "Andika"] },
  { hari: "Kamis", nama: ["Afika Naila", "Tubagus Angke", "Syahrul Ramadhan"] },
  { hari: "Jum'at", nama: ["Jum'at Bersih"] },
  { hari: "Sabtu", nama: ["Maftukhatus Sa'adah", "Kholifah", "Diah Indah", "Widia Tamara"] },
]

export default function PiketKelas() {
  return (
    <div className="flex flex-col md:mx-20 mx-5 min-h-screen">
      <div className="flex w-full my-10 items-center justify-between gap-10">
        <Link
          href="/kelas-5"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm md:text-base"
        >
          <span className="font-semibold">&lt;</span> Kembali
        </Link>
        <div className="flex-1 flex justify-center">
          <h2 className="md:w-fit w-full lg:text-2xl md:text-xl font-semibold tracking-wide shadow-md bg-white py-2 md:py-3 px-5 rounded-lg text-center">
            Piket Kelas 5
          </h2>
        </div>
      </div>
      <div className="w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 mb-10 text-center md:text-xl">
        {jadwalPiket.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg p-4 transition duration-200 hover:-translate-y-1 hover:scale-105"
          >
            <h4 className="font-bold text-lg mb-2 underline">{item.hari}</h4>
            <ul className=" text-gray-700 list-none">
              {item.nama.map((nama, i) => (
                <li className='mb-2' key={i}>{nama}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
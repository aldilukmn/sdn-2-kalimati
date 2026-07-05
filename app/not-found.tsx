import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-5 py-10 motion-safe:animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 overflow-hidden">
        <div className="h-1 bg-amber-400" />
        <div className="px-8 py-12 text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-700 p-2.5 flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dhtfq9yw8/image/upload/v1717920310/uptd%20sdn%202%20kalimati/svg/vapqm0latukpxjjawzfu.svg"
              alt="SDN 2 Kalimati"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
            Maaf, halaman yang Anda cari tidak tersedia.
          </p>

          <div className="w-12 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-8" />

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

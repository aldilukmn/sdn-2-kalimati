import { ArrowBigLeft } from 'lucide-react';
import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="self-start mb-5 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
    >
      <button className="cursor-pointer flex items-center gap-1 border px-4 py-2 rounded-lg text-sm duration-300 text-white bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700">
        <ArrowBigLeft size={18} />
        <span className="text-xs md:text-sm">Kembali</span>
      </button>
    </Link>
  );
}
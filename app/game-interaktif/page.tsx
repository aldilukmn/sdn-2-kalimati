"use client";

import { useState } from "react";
import { Gamepad2, ExternalLink } from "lucide-react";
import BackButton from "@/components/common/BackButton";
import Pagination from "@/components/common/Pagination";
import { gameLinks } from './data/data.game.interaktif';

const ITEMS_PER_PAGE = 10;

export default function GameInteraktif() {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedLinks = [...gameLinks].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const totalPages = Math.ceil(sortedLinks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLinks = sortedLinks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center justify-center gap-5 md:gap-8 px-5 py-7 md:py-10">
      <BackButton />

      <div className="flex items-center gap-3">
        <Gamepad2 size={32} className="text-emerald-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Game Interaktif
        </h1>
      </div>

      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-lg">
        Kumpulan link game edukatif interaktif untuk mendukung pembelajaran
        siswa SD. Klik tombol <strong>Kunjungi</strong> untuk membuka di tab
        baru.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 w-full max-w-6xl mt-5">
        {paginatedLinks.map((game, i) => {
          const globalNum = startIndex + i + 1;
          const num = String(globalNum).padStart(2, "0");
          return (
            <div
              key={startIndex + i}
              className="flex flex-col items-center gap-3 border border-emerald-500/40 bg-emerald-500/5 px-5 py-6 rounded-xl text-center duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/10"
            >
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/15 px-3 py-1 rounded-full">
                #{num}
              </span>

              <Gamepad2 size={28} className="text-emerald-500/70" />

              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                {game.name}
              </span>

              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Kunjungi
                <ExternalLink size={14} />
              </a>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={sortedLinks.length}
      />
    </div>
  );
}

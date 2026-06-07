"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 2,
  totalItems = 0,
}: PaginationProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPageButtons; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPageButtons + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage}
          className={`p-2 rounded-lg border transition-all ${
            hasPreviousPage
              ? "border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/15 cursor-pointer"
              : "border-gray-500/30 bg-gray-500/5 cursor-not-allowed opacity-50"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-10 h-10 rounded-lg border transition-all font-medium ${
                page === currentPage
                  ? "border-blue-500 bg-blue-500/20 text-blue-400"
                  : "border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/15 cursor-pointer"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className={`p-2 rounded-lg border transition-all ${
            hasNextPage
              ? "border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/15 cursor-pointer"
              : "border-gray-500/30 bg-gray-500/5 cursor-not-allowed opacity-50"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {totalItems > 0 && (
        <p className="text-sm opacity-60">
          Menampilkan {startItem} - {endItem} dari {totalItems} data
        </p>
      )}

      <p className="text-sm opacity-60">
        Halaman {currentPage} dari {totalPages}
      </p>
    </div>
  );
}

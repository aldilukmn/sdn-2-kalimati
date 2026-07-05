"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col items-center gap-2 md:gap-4 mt-6 text-gray-900 dark:text-gray-200 animate-fadeIn">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon-sm"
                onClick={() => handlePageClick(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

      {totalItems > 0 && (
        <p className="text-xs md:text-sm opacity-60">
          Menampilkan {startItem} - {endItem} dari {totalItems} data
        </p>
      )}

      <p className="text-xs md:text-sm opacity-60">
        Halaman {currentPage} dari {totalPages}
      </p>
    </div>
  );
}

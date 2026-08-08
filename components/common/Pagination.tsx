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
    <div className="@container w-full mt-6">
      <div className="flex flex-row items-center justify-between gap-3 text-gray-900 dark:text-gray-200 w-full">
        <div className="text-xs sm:text-sm opacity-70 whitespace-nowrap">
        {totalItems > 0 ? (
          <p>
            <span className="hidden sm:inline">Menampilkan </span>
            {startItem}-{endItem} 
            <span className="hidden sm:inline"> dari </span>
            <span className="sm:hidden"> / </span>
            {totalItems}
            <span className="hidden sm:inline"> data</span>
          </p>
        ) : (
          <p>
            <span className="hidden sm:inline">Halaman </span>
            {currentPage} 
            <span className="hidden sm:inline"> dari </span>
            <span className="sm:hidden"> / </span>
            {totalPages}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0"
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
              className={`shrink-0 ${page === currentPage ? "" : "hidden @md:inline-flex"}`}
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
          className="shrink-0"
          onClick={handleNextPage}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";

export function usePagination<T>(
  data: T[],
  itemsPerPage: number,
  resetDependencies: React.DependencyList = []
) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDependencies);

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const paginatedData = useMemo(() => {
    if (!data) return [];
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, startIndex, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    paginatedData,
    totalItems,
  };
}

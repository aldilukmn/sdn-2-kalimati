"use client";

import { useState } from "react";
import StudentSavingsService from "@/services/student-savings.service";
import { StudentWithBalance } from "@/hooks/useStudentList";
import type { Transaction } from "@/types/student-savings";
import { HISTORY_LIMIT } from "@/lib/constants";

export function useHistoryModal({
  refreshList,
  setMessage,
}: {
  refreshList: () => Promise<void>;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
}) {
  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    student: StudentWithBalance | null;
  }>({ open: false, student: null });
  const [historyType, setHistoryType] = useState<string | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [historyMonth, setHistoryMonth] = useState(new Date().getMonth() + 1);
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  const [historyAllTime, setHistoryAllTime] = useState(false);

  const openHistoryModal = async (student: StudentWithBalance, type?: string, allTime?: boolean) => {
    const curMonth = new Date().getMonth() + 1;
    const curYear = new Date().getFullYear();
    setHistoryModal({ open: true, student });
    setHistoryPage(1);
    setHistoryType(type);
    setHistoryAllTime(!!allTime);
    setHistoryMonth(curMonth);
    setHistoryYear(curYear);
    setHistoryLoading(true);
    try {
      const res = await StudentSavingsService.getTransactions(
        student.studentId,
        1,
        HISTORY_LIMIT,
        type,
        allTime ? undefined : curMonth,
        allTime ? undefined : curYear
      );
      if (res?.result) {
        setTransactions(res.result.transactions || []);
        setHistoryTotal(res.result.total || 0);
        setHistoryTotalPages(res.result.totalPages || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistoryModal = () => {
    setHistoryModal({ open: false, student: null });
    setTransactions([]);
    setHistoryAllTime(false);
  };

  const fetchHistoryPage = async (page: number, type?: string, month?: number, year?: number) => {
    if (!historyModal.student) return;
    setHistoryLoading(true);
    setHistoryPage(page);
    const filterType = type === "all" ? undefined : type !== undefined ? type : historyType;
    const filterMonth = month !== undefined ? month : historyMonth;
    const filterYear = year !== undefined ? year : historyYear;
    try {
      const res = await StudentSavingsService.getTransactions(
        historyModal.student.studentId,
        page,
        HISTORY_LIMIT,
        filterType,
        historyAllTime ? undefined : filterMonth,
        historyAllTime ? undefined : filterYear
      );
      if (res?.result) {
        setTransactions(res.result.transactions || []);
        setHistoryTotal(res.result.total || 0);
        setHistoryTotalPages(res.result.totalPages || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return {
    historyModal,
    openHistoryModal,
    closeHistoryModal,
    historyType,
    setHistoryType,
    historyMonth,
    setHistoryMonth,
    historyYear,
    setHistoryYear,
    historyAllTime,
    setHistoryAllTime,
    transactions,
    historyLoading,
    historyPage,
    historyTotal,
    historyTotalPages,
    fetchHistoryPage,
  };
}

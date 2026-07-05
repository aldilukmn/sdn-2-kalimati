"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { useStudentList } from "@/hooks/useStudentList";
import { GRADES } from "@/lib/constants";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { useHistoryModal } from "@/hooks/useHistoryModal";
import { useStudentMonthlyBreakdown } from "@/hooks/useStudentMonthlyBreakdown";
import DateDayPicker from "@/app/components/DateDayPicker";
import toast from "react-hot-toast";
import { getTodayLocal } from "@/lib/format";
import HolidayInfoCard from "@/app/components/HolidayInfoCard";
import PageHero from "@/app/components/PageHero";
import { useHolidays } from "@/hooks/useHolidays";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DailyTab from "@/app/components/tabungan/DailyTab";
import MonthlyTab from "@/app/components/tabungan/MonthlyTab";
import TransactionModal from "@/app/components/tabungan/TransactionModal";
import HistoryModal from "@/app/components/tabungan/HistoryModal";
import EditModal from "@/app/components/tabungan/EditModal";
import ConfirmDeleteModal from "@/app/components/tabungan/ConfirmDeleteModal";

export default function TabunganMuridPage() {
  const {
    userRole,
    userGrade,
    isTreasurer,
    grade,
    setGrade,
    date,
    setDate,
    paginatedStudents,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    summary,
    summaryLoading,
    message,
    setMessage,
    students,
    exportExcel,
    refreshList,
  } = useStudentList();

  const {
    txModal,
    openTxModal,
    closeTxModal,
    txAmount,
    setTxAmount,
    txDescription,
    setTxDescription,
    saving,
    handleSaveTransaction,
  } = useTransactionModal({ grade, date, refreshList, setMessage });

  const {
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
    transactions,
    historyLoading,
    historyPage,
    historyTotal,
    historyTotalPages,
    fetchHistoryPage,
    editingTx,
    deletingId,
    editModal,
    editAmount,
    setEditAmount,
    editDate,
    setEditDate,
    editDescription,
    setEditDescription,
    editSaving,
    openEditModal,
    closeEditModal,
    submitEditTransaction,
    confirmDelete,
    closeConfirmDelete,
    submitDeleteTransaction,
    handleDeleteTransaction,
  } = useHistoryModal({ refreshList, setMessage });

  const [activeTab, setActiveTab] = useState<"harian" | "bulanan">("harian");
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyPage, setMonthlyPage] = useState(1);
  const MONTHLY_PER_PAGE = 5;
  const { holidayList, holidays: blockedDates, isHoliday: checkHoliday, getHoliday } = useHolidays();
  const isHoliday = checkHoliday(date);
  const currentHoliday = getHoliday(date);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: monthlyData, loading: monthlyLoading } = useStudentMonthlyBreakdown(
    userRole === "guru" ? userGrade || grade : grade,
    year,
    refreshKey
  );
  const monthlyTotalPages = Math.ceil(monthlyData.length / MONTHLY_PER_PAGE);
  const monthlyPaginated = monthlyData.slice(
    (monthlyPage - 1) * MONTHLY_PER_PAGE,
    monthlyPage * MONTHLY_PER_PAGE
  );

  useEffect(() => { setMonthlyPage(1); }, [grade, year]);

  useEffect(() => {
    if (message) {
      if (message.type === "success") {
        toast.success(message.text);
        setRefreshKey((k) => k + 1);
      } else {
        toast.error(message.text);
      }
      setMessage(null);
    }
  }, [message, setMessage]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero icon={Wallet} title="Tabungan Murid" description="Kelola tabungan murid per kelas" />

      {/* Filter */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Kelas</label>
            {userRole !== "admin" && userRole !== "kepala" && !isTreasurer ? (
              <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-slate-800 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                {userGrade || grade}
              </div>
            ) : (
              <Select
                value={grade}
                onValueChange={(v) => {
                  if (v !== null) setGrade(v);
                }}
              >
                <SelectTrigger className="w-full h-auto rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kelas</SelectLabel>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Tanggal</label>
            <DateDayPicker value={date} onChange={setDate} max={getTodayLocal()} blockedDates={blockedDates} />
          </div>
        </div>
      </div>

      {isHoliday ? (
        <HolidayInfoCard currentHoliday={currentHoliday} message="Tidak bisa melakukan transaksi tabungan pada hari libur." />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("harian")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "harian"
                  ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Transaksi Harian
            </button>
            <button
              onClick={() => setActiveTab("bulanan")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "bulanan"
                  ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Rekap Bulanan
            </button>
          </div>

          {activeTab === "harian" ? (
            <DailyTab
              summary={summary}
              summaryLoading={summaryLoading}
              students={students}
              paginatedStudents={paginatedStudents}
              loading={loading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              exportExcel={exportExcel}
              openTxModal={openTxModal}
              openHistoryModal={openHistoryModal}
            />
          ) : (
            <MonthlyTab
              monthlyLoading={monthlyLoading}
              monthlyData={monthlyData}
              monthlyPaginated={monthlyPaginated}
              monthlyPage={monthlyPage}
              setMonthlyPage={setMonthlyPage}
              monthlyTotalPages={monthlyTotalPages}
              MONTHLY_PER_PAGE={MONTHLY_PER_PAGE}
              year={year}
              setYear={setYear}
              openHistoryModal={openHistoryModal}
              closeHistoryModal={closeHistoryModal}
            />
          )}
        </>
      )}

      <TransactionModal
        open={txModal.open}
        student={txModal.student}
        mode={txModal.mode}
        closeTxModal={closeTxModal}
        txAmount={txAmount}
        setTxAmount={setTxAmount}
        txDescription={txDescription}
        setTxDescription={setTxDescription}
        saving={saving}
        handleSaveTransaction={handleSaveTransaction}
      />

      <HistoryModal
        open={historyModal.open}
        student={historyModal.student}
        closeHistoryModal={closeHistoryModal}
        historyType={historyType}
        setHistoryType={setHistoryType}
        historyMonth={historyMonth}
        setHistoryMonth={setHistoryMonth}
        historyYear={historyYear}
        setHistoryYear={setHistoryYear}
        historyAllTime={historyAllTime}
        transactions={transactions}
        historyLoading={historyLoading}
        historyPage={historyPage}
        historyTotal={historyTotal}
        historyTotalPages={historyTotalPages}
        fetchHistoryPage={fetchHistoryPage}
        editSaving={editSaving}
        openEditModal={openEditModal}
        handleDeleteTransaction={handleDeleteTransaction}
        deletingId={deletingId}
      />

      <EditModal
        open={editModal.open}
        transaction={editModal.transaction}
        closeEditModal={closeEditModal}
        editAmount={editAmount}
        setEditAmount={setEditAmount}
        editDate={editDate}
        setEditDate={setEditDate}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editSaving={editSaving}
        submitEditTransaction={submitEditTransaction}
      />

      <ConfirmDeleteModal
        open={confirmDelete.open}
        txId={confirmDelete.txId}
        deletingId={deletingId}
        closeConfirmDelete={closeConfirmDelete}
        submitDeleteTransaction={submitDeleteTransaction}
      />
    </div>
  );
}

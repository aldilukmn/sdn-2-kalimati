"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Wallet,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from "lucide-react";
import { useStudentList } from "@/hooks/useStudentList";
import { GRADES } from "@/lib/constants";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { useHistoryModal } from "@/hooks/useHistoryModal";
import { useStudentMonthlyBreakdown } from "@/hooks/useStudentMonthlyBreakdown";
import { useGradeRecap } from "@/hooks/useGradeRecap";
import DateDayPicker from "@/app/components/DateDayPicker";
import StatCard from "@/app/components/StatCard";
import toast from "react-hot-toast";
import { getTodayLocal, MONTHS_ID, formatCompactRupiah } from "@/lib/format";
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
import GradeRecapTable from "@/app/components/tabungan/GradeRecapTable";
import TransactionModal from "@/app/components/tabungan/TransactionModal";
import HistoryModal from "@/app/components/tabungan/HistoryModal";
import EditModal from "@/app/components/tabungan/EditModal";
import ConfirmDeleteModal from "@/app/components/tabungan/ConfirmDeleteModal";

export default function TabunganMuridPage() {
  const {
    userRole,
    userGrade,
    isSavingsHolder,
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

  const [gradeRecapMode, setGradeRecapMode] = useState<"daily" | "monthly">("daily");
  const [gradeRecapMonth, setGradeRecapMonth] = useState(new Date().getMonth() + 1);
  const [gradeRecapYear, setGradeRecapYear] = useState(new Date().getFullYear());
  const { data: gradeRecapData, loading: gradeRecapLoading } = useGradeRecap(
    gradeRecapMode === "daily" ? date : undefined,
    gradeRecapMode === "monthly" ? gradeRecapMonth : undefined,
    gradeRecapMode === "monthly" ? gradeRecapYear : undefined,
    refreshKey,
  );

  const summary = useMemo(() => {
    if (gradeRecapMode !== "daily" || gradeRecapData.length === 0 || !grade) return null;
    const gradeData = gradeRecapData.find(g => g.grade === grade);
    return gradeData ? {
      totalStudents: gradeData.totalStudents,
      dailyDeposits: gradeData.deposits,
      dailyWithdrawals: gradeData.withdrawals,
    } : null;
  }, [gradeRecapData, gradeRecapMode, grade]);
  const summaryLoading = gradeRecapLoading;

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

  const showGradeRecap = userRole === "admin" || userRole === "kepala" || isSavingsHolder;


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHero
        icon={Wallet}
        title="Tabungan Murid"
        description="Kelola tabungan murid per kelas"
      />

      {/* Filter */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Kelas
            </label>
            {userRole !== "admin" && userRole !== "kepala" ? (
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
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              Tanggal
            </label>
            <DateDayPicker
              value={date}
              onChange={setDate}
              max={getTodayLocal()}
              blockedDates={blockedDates}
            />
          </div>
        </div>
      </div>

      {showGradeRecap && (
        <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-2.5 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                <Wallet
                  size={16}
                  className="text-indigo-600 dark:text-indigo-300"
                />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Rekap Tabungan per Kelas
              </h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto md:ml-auto">
              <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-gray-900 rounded-lg p-0.5 w-full md:w-auto order-2 md:order-1 tracking-wide">
                <button
                  onClick={() => setGradeRecapMode("daily")}
                  className={`px-2.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    gradeRecapMode === "daily"
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setGradeRecapMode("monthly")}
                  className={`px-2.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    gradeRecapMode === "monthly"
                      ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  Bulanan
                </button>
              </div>
              {gradeRecapMode === "monthly" && (
                <div className="grid grid-cols-2 gap-1 w-full md:w-auto order-1 md:order-2">
                  <Select
                    value={String(gradeRecapMonth)}
                    onValueChange={(v) => {
                      if (v !== null) setGradeRecapMonth(Number(v));
                    }}
                  >
                    <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-full">
                      <SelectValue placeholder="Bulan" className="sr-only" />
                      {MONTHS_ID[gradeRecapMonth - 1]}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bulan</SelectLabel>
                        {MONTHS_ID.map((name, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(gradeRecapYear)}
                    onValueChange={(v) => {
                      if (v !== null) setGradeRecapYear(Number(v));
                    }}
                  >
                    <SelectTrigger className="h-auto rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 w-full">
                      <SelectValue placeholder="Tahun" className="sr-only" />
                      {gradeRecapYear}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tahun</SelectLabel>
                        {[2026, 2027].map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          {gradeRecapMode === "daily" && isHoliday ? (
            <HolidayInfoCard
              currentHoliday={currentHoliday}
              message="Tidak ada data tabungan — hari libur."
            />
          ) : (
            <GradeRecapTable
              data={gradeRecapData}
              loading={gradeRecapLoading}
              mode={gradeRecapMode}
            />
          )}
        </div>
      )}

      {isHoliday ? (
        <HolidayInfoCard
          currentHoliday={currentHoliday}
          message="Tidak bisa melakukan transaksi tabungan pada hari libur."
        />
      ) : (
        <>
          <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 animate-fadeIn relative z-10">
            <div className="flex gap-1 bg-slate-100 dark:bg-gray-900 rounded-xl p-1 w-full md:w-fit">
              <button
                onClick={() => setActiveTab("harian")}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === "harian"
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Transaksi Harian
              </button>
              <button
                onClick={() => setActiveTab("bulanan")}
                className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === "bulanan"
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Rekap Bulanan
              </button>
            </div>
            {activeTab === "harian" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard
                  variant="simple"
                  label="Penabung"
                  value={summary?.totalStudents || 0}
                  icon={Users}
                  color="sky"
                  loading={summaryLoading}
                  suffix=" murid"
                />
                <StatCard
                  variant="simple"
                  label="Setoran"
                  value={formatCompactRupiah(summary?.dailyDeposits || 0)}
                  icon={TrendingUp}
                  color="emerald"
                  loading={summaryLoading}
                />
                <StatCard
                  variant="simple"
                  label="Penarikan"
                  value={formatCompactRupiah(summary?.dailyWithdrawals || 0)}
                  icon={TrendingDown}
                  color="rose"
                  loading={summaryLoading}
                />
                <StatCard
                  variant="simple"
                  label="Selisih"
                  value={formatCompactRupiah(
                    (summary?.dailyDeposits || 0) -
                      (summary?.dailyWithdrawals || 0),
                  )}
                  icon={ArrowLeftRight}
                  color="violet"
                  loading={summaryLoading}
                  valueClassName={
                    summaryLoading
                      ? ""
                      : (summary?.dailyDeposits || 0) -
                            (summary?.dailyWithdrawals || 0) >=
                          0
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-red-600 dark:text-red-400"
                  }
                />
              </div>
            )}
          </div>

          {activeTab === "harian" ? (
            <DailyTab
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

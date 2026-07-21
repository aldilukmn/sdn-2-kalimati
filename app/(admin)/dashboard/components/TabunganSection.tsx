"use client";

import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useSavingsRecap } from "@/hooks/useSavingsRecap";
import { GRADES } from "@/lib/constants";
import { formatCompactRupiah } from "@/lib/format";
import StatCard from "@/components/common/StatCard";
import dynamic from "next/dynamic";
const SavingsTrendChart = dynamic(() => import("@/components/charts/SavingsTrendChart"), { ssr: false });
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MonthYearFilter from "@/components/shared/MonthYearFilter";

export default function TabunganSection({
  grade,
  userRole,
  isSavingsHolder,
}: {
  grade?: string | null;
  userRole?: string | null;
  isSavingsHolder?: boolean;
}) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [filterGrade, setFilterGrade] = useState(grade ?? "");
  const { data, loading } = useSavingsRecap(
    filterGrade || undefined,
    month,
    year,
  );

  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md: border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2.5 mb-4">
        <div className="flex items-center gap-2.5 mb-3 md:mb-0">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
            <Wallet size={16} className="text-indigo-600 dark:text-indigo-300" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Rekapitulasi Tabungan
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 w-full md:flex md:w-auto md:items-center md:gap-2.5 md:ml-auto">
          {userRole === "guru" && !isSavingsHolder ? (
            <Select
              value={filterGrade}
              onValueChange={(v) => { if (v !== null) setFilterGrade(v); }}
              disabled
            >
              <SelectTrigger className="h-auto w-full md:w-32 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Semua Kelas" className="sr-only" />
                {filterGrade ? `Kelas ${filterGrade}` : "Semua Kelas"}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  <SelectItem value="">Semua Kelas</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={filterGrade}
              onValueChange={(v) => { if (v !== null) setFilterGrade(v); }}
            >
              <SelectTrigger className="h-auto w-full md:w-32 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100">
                <SelectValue placeholder="Semua Kelas" className="sr-only" />
                {filterGrade ? `Kelas ${filterGrade}` : "Semua Kelas"}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kelas</SelectLabel>
                  <SelectItem value="">Semua Kelas</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>Kelas {g}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <MonthYearFilter month={month} onMonthChange={setMonth} year={year} onYearChange={setYear} variant="dashboard" className='w-full' />
        </div>
      </div>

      {!loading &&
      data &&
      data.monthlyDeposits === 0 &&
      data.monthlyWithdrawals === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-3xl mb-2">🏦</div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Belum Ada Data Tabungan
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Belum ada murid yang menabung di bulan ini
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            variant="simple"
            label="Total Saldo"
            value={formatCompactRupiah(data?.totalBalance || 0)}
            icon={Wallet}
            color="sky"
            loading={loading}
            subtitle={data ? `${data.totalStudents || 0} murid menabung` : undefined}
          />
          <StatCard
            variant="simple"
            label="Setoran Bulan Ini"
            value={formatCompactRupiah(data?.monthlyDeposits || 0)}
            icon={TrendingUp}
            color="emerald"
            loading={loading}
          />
          <StatCard
            variant="simple"
            label="Penarikan Bulan Ini"
            value={formatCompactRupiah(data?.monthlyWithdrawals || 0)}
            icon={TrendingDown}
            color="rose"
            loading={loading}
          />
          <StatCard
            variant="simple"
            label="Selisih Bulan Ini"
            value={formatCompactRupiah((data?.monthlyDeposits || 0) - (data?.monthlyWithdrawals || 0))}
            icon={TrendingUp}
            color="violet"
            loading={loading}
            valueClassName={
              loading
                ? ""
                : (data?.monthlyDeposits || 0) - (data?.monthlyWithdrawals || 0) >= 0
                  ? "text-violet-700 dark:text-violet-300"
                  : "text-red-600 dark:text-red-400"
            }
          />
        </div>
      )}
      <div className="mt-4 bg-slate-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-gray-700/30">
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2">
          Tren Tabungan {year}
        </p>
        <SavingsTrendChart year={year} grade={filterGrade || undefined} />
      </div>
    </div>
  );
}

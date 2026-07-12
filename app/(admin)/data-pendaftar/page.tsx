"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import {
  Printer,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  RefreshCw,
  Download,
  ClipboardList,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import RegistrationService from "@/services/registration.service";
import Pagination from "@/app/components/Pagination";
import StatCard from "@/app/components/StatCard";
import PageHero from "@/app/components/PageHero";
import { exportRegistrantsToCSV } from "@/lib/export-csv";
import { printRegistrantForm } from "@/lib/print-form";
import { formatDateID } from "@/lib/format";
import type { Registrant, PaginatedRegistrants } from "@/types/registration";
import TableSkeleton from "@/app/components/TableSkeleton";
import EmptyState from "@/app/components/shared/EmptyState";

const formatDateTime = (isoStr?: string): string => {
  if (!isoStr) return "-";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "-";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${formatDateID(d.toISOString().slice(0, 10))} ${h}:${m}`;
};

export default function DataPendaftar() {
  const router = useRouter();
  const { role: authRole, isLoading: authLoading } = useAuth();
  const userRole = authRole;
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPagesState, setTotalPagesState] = useState(1);
  const [totalValidated, setTotalValidated] = useState(0);
  const [totalUnvalidated, setTotalUnvalidated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [validating, setValidating] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRegistrants = async (page?: number, isRefresh?: boolean) => {
    const targetPage = page || currentPage;
    if (!loading) setPageLoading(true);
    try {
      const response = await RegistrationService.getAll(targetPage, ITEMS_PER_PAGE);
      const result = response.result || response.data || {} as PaginatedRegistrants;
      setRegistrants(result.data || []);
      setTotalItems(result.total || 0);
      setTotalPagesState(result.totalPages || 1);
      setTotalValidated(result.totalValidated || 0);
      setTotalUnvalidated(result.totalUnvalidated || 0);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      toast.error(error.message || "Gagal memuat data pendaftar");
    } finally {
      if (isRefresh) setRefreshing(false);
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchRegistrants(currentPage);
  }, [authRole, authLoading, currentPage]);

  useEffect(() => {
    if (authLoading) return;
    const interval = setInterval(() => fetchRegistrants(currentPage), 30000);
    return () => clearInterval(interval);
  }, [authRole, authLoading, currentPage]);

  // Route guard: proxy.ts sudah enforce role-based access

  const handleExport = async () => {
    try {
      const response = await RegistrationService.getAll();
      const allData = response.result?.data || [];
      exportRegistrantsToCSV(allData);
    } catch {
      toast.error("Gagal mengekspor data");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRegistrants(currentPage, true);
  };

  const handleValidate = async (id: string, currentStatus?: string) => {
    try {
      setValidating((prev) => new Set(prev).add(id));

      const newStatus =
        currentStatus === "validated" ? "unvalidated" : "validated";

      await RegistrationService.updateData(id, { status: newStatus });

      setRegistrants((prev) =>
        prev.map((reg) =>
          reg._id === id || reg.id === id ? { ...reg, status: newStatus } : reg,
        ),
      );
      if (newStatus === "validated") {
        setTotalValidated((prev) => prev + 1);
        setTotalUnvalidated((prev) => Math.max(0, prev - 1));
      } else {
        setTotalValidated((prev) => Math.max(0, prev - 1));
        setTotalUnvalidated((prev) => prev + 1);
      }
    } catch (err) {
      const error = err as Error & {
        status?: number;
      };

      if (error.status === 401) {
        router.replace("/");
        return;
      }

      toast.error(error.message || "Gagal memperbarui status validasi");
    } finally {
      setValidating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  const handlePrint = (registrant: Registrant) => {
    printRegistrantForm(registrant);
  };

  if (authLoading) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHero icon={ClipboardList} title="Data Pendaftar" description="Kelola data pendaftar dan validasi formulir" className="animate-fadeInUp" />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Total Pendaftar" value={totalItems} icon={Users} color="blue" loading={loading} />
        <StatCard label="Tervalidasi" value={totalValidated} icon={CheckCircle2} color="emerald" loading={loading} />
        <StatCard label="Belum Divalidasi" value={totalUnvalidated} icon={Circle} color="yellow" loading={loading} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end flex-wrap animate-fadeInUp">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer"
          title="Export ke Excel"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Export Excel</span>
        </button>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Perbarui Data"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">
            {refreshing ? "Memuat..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 md:backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
        {loading || pageLoading ? (
          <TableSkeleton
            headers={[
              "No. Pendaftaran", "Tanggal Daftar", "Tanggal Update",
              "Nama Lengkap", "No. HP", "Alamat", "Aksi",
              ...(userRole !== "kepala" ? ["Validasi"] : []),
            ]}
            rows={5}
          />
        ) : totalItems === 0 ? (
          <EmptyState icon={Users} title="Belum ada data pendaftar" />
        ) : (
          <div
            key="data"
            className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 md:bg-white/60 dark:bg-gray-800/30"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-700 text-indigo-50 tracking-wider text-xs md:text-sm">
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    No. Pendaftaran
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    Tanggal Daftar
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    Tanggal Update
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    Nama Lengkap
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    No. HP
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left font-semibold">
                    Alamat
                  </th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-center font-semibold">
                    Aksi
                  </th>
                  {userRole !== "kepala" && (
                    <th className="px-3 py-3 md:px-6 md:py-4 text-center font-semibold">
                      Validasi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 animate-fadeInUp">
                {registrants.map((registrant, index) => (
                  <tr
                    key={registrant._id || registrant.id}
                    className="transition-colors animate-fadeIn hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                  >
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {registrant.registrationNumber || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formatDateTime(registrant.createdAt)}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formatDateTime(registrant.updatedAt)}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {registrant.student?.fullName || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {registrant.contactPhoneNumber || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {registrant.student?.address?.street
                        ? `${registrant.student.address.street}, ${registrant.student.address.village || ""} ${registrant.student.address.district || ""}`
                        : "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handlePrint(registrant)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30 cursor-pointer"
                          title="Cetak Formulir"
                        >
                          <Printer size={18} />
                        </button>
                        {userRole !== "kepala" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/data-pendaftar/edit/${registrant._id || registrant.id}`,
                              )
                            }
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer"
                            title="Edit Data"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                    {userRole !== "kepala" && (
                      <td className="px-3 py-3 md:px-6 md:py-4 text-center">
                        <button
                          onClick={() =>
                            handleValidate(
                              registrant._id as string,
                              registrant.status,
                            )
                          }
                          disabled={validating.has(registrant._id as string)}
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                            validating.has(registrant._id as string)
                              ? "cursor-not-allowed opacity-75"
                              : "cursor-pointer"
                          } ${
                            registrant.status === "validated"
                              ? validating.has(registrant._id as string)
                                ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 animate-pulse"
                                : "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 hover:scale-110"
                              : validating.has(registrant._id as string)
                                ? "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 animate-pulse"
                                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-110"
                          }`}
                          title={
                            validating.has(registrant._id as string)
                              ? "Sedang memproses..."
                              : registrant.status === "validated"
                                ? "Data Tervalidasi"
                                : "Data Belum Tervalidasi"
                          }
                        >
                          {validating.has(registrant._id as string) ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : registrant.status === "validated" ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPagesState}
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        )}
      </div>
    </div>
  );
}

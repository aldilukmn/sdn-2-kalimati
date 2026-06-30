"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Printer,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  RefreshCw,
  Download,
  ClipboardCheck,
} from "lucide-react";
import RegistrationService from "@/services/registration.service";
import Pagination from "@/app/components/Pagination";
import { exportRegistrantsToCSV } from "@/lib/export-csv";

interface Address {
  street?: string;
  rt?: string;
  rw?: string;
  village?: string;
  district?: string;
  postalCode?: string;
}

interface Parent {
  name?: string;
  birthYear?: string;
  occupation?: string;
  education?: string;
  monthlyIncome?: string;
  nik?: string;
}

interface Guardian {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
}

interface Student {
  address?: Address;
  fullName?: string;
  nik?: string;
  nisn?: string;
  noKk?: string;
  birthPlace?: string;
  birthDate?: Date;
  gender?: string;
  religion?: string;
  childOrder?: string;
  kindergartenOrigin?: string;
  numberOfSiblings?: string;
}

interface Registrant {
  _id?: string;
  id?: string;
  student?: Student;
  father?: Parent;
  mother?: Parent;
  guardian?: Guardian;
  registrationNumber?: string;
  status?: string;
  contactPhoneNumber?: string;
  hasGuardian?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const formatBirthDate = (date: Date | string | undefined): string => {
  if (!date) return "-";

  const birthDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(birthDate.getTime())) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = birthDate.getDate();
  const month = months[birthDate.getMonth()];
  const year = birthDate.getFullYear();

  return `${day} ${month} ${year}`;
};

const formatCreatedDate = (date: Date | string | undefined): string => {
  if (!date) return "-";

  const createdDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(createdDate.getTime())) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = createdDate.getDate();
  const month = months[createdDate.getMonth()];
  const year = createdDate.getFullYear();
  const hours = String(createdDate.getHours()).padStart(2, "0");
  const minutes = String(createdDate.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export default function DataPendaftar() {
  const router = useRouter();
  const { userRole: authRole, isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;

  const fetchRegistrants = async (isRefresh?: boolean) => {
    try {
      const response = await RegistrationService.getAll();
      const data = response.result || response.data || [];
      setRegistrants(data);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 401) {
        router.replace("/login");
        return;
      }
      setError(error.message || "Gagal memuat data pendaftar");
    } finally {
      if (isRefresh) setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || (authRole !== "admin" && authRole !== "kepala")) return;
    fetchRegistrants();
    const interval = setInterval(() => fetchRegistrants(), 30000);
    return () => clearInterval(interval);
  }, [authRole, authLoading]);

  useEffect(() => {
    const token = sessionStorage.getItem("user_session");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch {}
    }
  }, []);

  // Route guard: hanya admin yang boleh akses
  useEffect(() => {
    if (!authLoading && authRole !== "admin" && authRole !== "kepala") {
      router.replace("/dashboard");
    }
  }, [authRole, authLoading]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRegistrants(true);
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
    } catch (err) {
      const error = err as Error & {
        status?: number;
      };

      if (error.status === 401) {
        router.replace("/");
        return;
      }

      setError(error.message || "Gagal memperbarui status validasi");
    } finally {
      setValidating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  const handlePrint = (registrant: Registrant) => {
    const fullName = registrant.student?.fullName || "-";
    const registrationNumber = registrant.registrationNumber || "-";
    const nik = registrant.student?.nik || "-";
    const address = registrant.student?.address;
    const addressStr = address
      ? `${address.street || ""} RT/RW ${address.rt || ""}/${address.rw || ""} ${address.village || ""} ${address.district || ""} ${address.postalCode || ""}`
      : "-";
    const phone = registrant.contactPhoneNumber || "-";
    const childOrder = registrant.student?.childOrder ?? 1;
    const siblings = Number(registrant.student?.numberOfSiblings ?? 0);
    const totalChildren = siblings + 1;

    const printContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 15px; margin: 0; line-height: 1.3; }
            @page { margin: 10mm; size: 210mm 330mm; }
            .header { text-align: center; margin-bottom: 15px; margin-top: 0px; }
            .logo { width: 100%; margin: 0 0 10px 0; }
            .logo img { width: 100%; height: auto; object-fit: contain; }
            .section { margin-bottom: 10px; page-break-inside: avoid; }
            .section-title { 
              font-weight: bold; 
              font-size: 15px;
              border-bottom: 2px solid #333; 
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .field-row {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
              margin-bottom: 6px;
            }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; font-size: 13px; margin-bottom: 2px; }
            .field-value { font-size: 13px; border-bottom: 1px solid #ccc; min-height: 18px; padding-top: 2px; }
            .footer { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; }
            .signature-line { border-top: 1px solid #333; width: 100px; margin: 90px auto 0; }
            .signature-date { font-size: 10px; margin-top: 5px; }
             .header-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; font-size: 12px; }
             .header-info-right { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <img src="/cop-sekolah.png" alt="Logo Sekolah" />
            </div>
            <div style="padding-top: 20px; margin-top: 20px; font-weight: bold; font-size: 16px;">
              FORMULIR PENDAFTARAN PESERTA DIDIK BARU
            </div>
            <div style="font-weight: bold; font-size: 15px; padding-bottom: 20px;">
              TAHUN AJARAN 2026/2027
            </div>
          </div>

          <div class="section">
            <div class="section-title">DATA CALON PESERTA DIDIK</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Nama Lengkap:</div>
                <div class="field-value">${fullName}</div>
              </div>
              <div class="field">
                <div class="field-label">NIK:</div>
                <div class="field-value">${nik}</div>
              </div>
              <div class="field">
                <div class="field-label">NISN:</div>
                <div class="field-value">${registrant.student?.nisn || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Nomor Kartu Keluarga:</div>
                <div class="field-value">${registrant.student?.noKk || "-"}</div>
              </div>
              <div class="field">
                <div class="field-label">Jenis Kelamin:</div>
                <div class="field-value">${registrant.student?.gender}</div>
              </div>
              <div class="field">
                <div class="field-label">Asal TK:</div>
                <div class="field-value">${registrant.student?.kindergartenOrigin || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Tempat Lahir:</div>
                <div class="field-value">${registrant.student?.birthPlace || "-"}</div>
              </div>
              <div class="field">
                <div class="field-label">Tanggal Lahir:</div>
                <div class="field-value">${formatBirthDate(registrant.student?.birthDate)}</div>
              </div>
              <div class="field">
                <div class="field-label">Agama:</div>
                <div class="field-value">${registrant.student?.religion || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Saudara Kandung:</div>
                <div class="field-value">${
                  siblings === 0
                    ? "Anak Tunggal"
                    : `Anak ke-${childOrder} dari ${totalChildren} bersaudara`
                }</div>
              </div>
              <div class="field">
                <div class="field-label">No. HP Orang Tua:</div>
                <div class="field-value">${phone}</div>
              </div>
              <div class="field">
                <div class="field-label">Alamat Lengkap:</div>
                <div class="field-value">${addressStr}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DATA ORANG TUA</div>
            <div style="margin-bottom: 8px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">Ayah:</div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.father?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">NIK:</div>
                  <div class="field-value">${registrant.father?.nik || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Tahun Lahir:</div>
                  <div class="field-value">${registrant.father?.birthYear || "-"}</div>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Pendidikan:</div>
                  <div class="field-value">${registrant.father?.education || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Pekerjaan:</div>
                  <div class="field-value">${registrant.father?.occupation || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Penghasilan:</div>
                  <div class="field-value">${registrant.father?.monthlyIncome || "-"}</div>
                </div>
              </div>
            </div>
            <div>
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">Ibu:</div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.mother?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">NIK:</div>
                  <div class="field-value">${registrant.mother?.nik || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Tahun Lahir:</div>
                  <div class="field-value">${registrant.mother?.birthYear || "-"}</div>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Pendidikan:</div>
                  <div class="field-value">${registrant.mother?.education || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Pekerjaan:</div>
                  <div class="field-value">${registrant.mother?.occupation || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Penghasilan:</div>
                  <div class="field-value">${registrant.mother?.monthlyIncome || "-"}</div>
                </div>
              </div>
            </div>
          </div>

          ${
            registrant.hasGuardian
              ? `
          <div class="section">
            <div class="section-title">DATA WALI</div>
            <div style="margin-bottom: 8px;">
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.guardian?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Hubungan Keluarga:</div>
                  <div class="field-value">${registrant.guardian?.relationship || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">No. HP:</div>
                  <div class="field-value">${registrant.guardian?.phoneNumber || "-"}</div>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <div class="footer">
            <div>
              <div>Orang Tua/Wali</div>
              <div class="signature-line"></div>
            </div>
            <div></div>
            <div>
              <div>Ketua Panitia</div>
              <div style="text-decoration: underline; text-underline-offset: 2px;margin-top: 70px">Nur'anisah Fitriyanti, S.Pd.</div>
              <div style="font-weight: bold; font-size: 15px;">NIP. 198501122025212077</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.document.title = `${registrationNumber}-${fullName}`;
      printWindow.print();
    }
  };

  const totalPages = Math.ceil(registrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRegistrants = registrants.slice(startIndex, endIndex);

  if (authLoading || (authRole !== "admin" && authRole !== "kepala")) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Data Pendaftar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Kelola data pendaftar dan validasi formulir
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-blue-500/40 bg-blue-500/5 px-5 py-6 rounded-xl duration-300 hover:bg-blue-500/10 hover:border-blue-500/60 hover:shadow-md hover:shadow-blue-500/10 shadow">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Total Pendaftar
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {loading ? (
              <div className="h-9 w-16 rounded bg-blue-200 dark:bg-blue-700 animate-pulse" />
            ) : (
              registrants.length
            )}
          </div>
        </div>
        <div className="border border-emerald-500/40 bg-emerald-500/5 px-5 py-6 rounded-xl duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/10 shadow">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tervalidasi
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {loading ? (
              <div className="h-9 w-16 rounded bg-emerald-200 dark:bg-emerald-700 animate-pulse" />
            ) : (
              registrants.filter((r) => r.status === "validated").length
            )}
          </div>
        </div>
        <div className="border border-yellow-500/40 bg-yellow-500/5 px-5 py-6 rounded-xl duration-300 hover:bg-yellow-500/10 hover:border-yellow-500/60 hover:shadow-md hover:shadow-yellow-500/10 shadow">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Belum Divalidasi
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {loading ? (
              <div className="h-9 w-16 rounded bg-yellow-200 dark:bg-yellow-700 animate-pulse" />
            ) : (
              registrants.filter((r) => r.status === "unvalidated").length
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end flex-wrap">
        <button
          onClick={() => exportRegistrantsToCSV(registrants)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors dark:bg-emerald-700 dark:hover:bg-emerald-800 cursor-pointer"
          title="Export ke Excel"
        >
          <Download size={20} />
          <span className="text-sm font-medium hidden sm:inline">
            Export Excel
          </span>
        </button>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Perbarui Data"
        >
          <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          <span className="text-sm font-medium hidden sm:inline">
            {refreshing ? "Memuat..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">No. Pendaftaran</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Daftar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Update</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No. HP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Alamat</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : registrants.length === 0 ? (
          <div className="border border-indigo-500/40 bg-indigo-500/5 px-5 py-6 rounded-xl text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada data pendaftar
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    No. Pendaftaran
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tanggal Daftar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tanggal Update
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    No. HP
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Alamat
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Aksi
                  </th>
                  {userRole !== "kepala" && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Validasi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {paginatedRegistrants.map((registrant, index) => (
                  <tr
                    key={registrant._id || registrant.id}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {registrant.registrationNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatCreatedDate(registrant.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatCreatedDate(registrant.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {registrant.student?.fullName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {registrant.contactPhoneNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {registrant.student?.address?.street
                        ? `${registrant.student.address.street}, ${registrant.student.address.village || ""} ${registrant.student.address.district || ""}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center flex">
                      <button
                        onClick={() => handlePrint(registrant)}
                        className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30 cursor-pointer"
                        title="Cetak Formulir"
                      >
                        <Printer size={20} />
                      </button>
                      {userRole !== "kepala" && (
                        <button
                          onClick={() =>
                            router.push(
                              `/data-pendaftar/edit/${registrant._id || registrant.id}`,
                            )
                          }
                          className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors dark:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer"
                          title="Edit Data"
                        >
                          <Pencil size={20} />
                        </button>
                      )}
                    </td>
                    {userRole !== "kepala" && (
                    <td className="px-6 py-4 text-center">
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
                              ? "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 animate-pulse"
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
                          <Loader2 size={20} className="animate-spin" />
                        ) : registrant.status === "validated" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Circle size={20} />
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
      </div>

      {/* Pagination */}
      {registrants.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          itemsPerPage={itemsPerPage}
          totalItems={registrants.length}
        />
      )}
    </div>
  );
}

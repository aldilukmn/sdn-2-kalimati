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
  ClipboardList,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
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
      toast.error(error.message || "Gagal memuat data pendaftar");
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
        const payload = JSON.parse(atob(token.split(".")[1]));
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

  if (authLoading || (authRole !== "admin" && authRole !== "kepala"))
    return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative p-5 md:p-6 flex items-center gap-4 animate-fadeInUp">
          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-xl flex items-center justify-center animate-iconBounce">
            <ClipboardList size={26} className="md:size-[30px] text-white" />
          </div>
          <div>
            <h1 className="text-white text-sm md:text-xl font-bold">
              Data Pendaftar
            </h1>
            <p className="text-indigo-200/80 text-xs md:text-sm mt-0.5">
              Kelola data pendaftar dan validasi formulir
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-blue-500/5 dark:bg-blue-500/10 md:backdrop-blur-xl border border-blue-500/40 dark:border-blue-500/30 shadow-lg rounded-2xl p-3 md:p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl">
          <div className="animate-fadeInUp">
            <div className="flex items-center md:items-start justify-center md:justify-between mb-1 md:mb-3 min-h-10">
              <span className="text-[13px] text-center md:text-base font-semibold text-gray-600 dark:text-gray-400">
                Total Pendaftar
              </span>
              <Users className="hidden md:block w-[22px] h-[22px] text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Users className="md:hidden w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-lg md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {loading ? (
                  <span className="inline-block h-9 w-16 rounded bg-indigo-200 dark:bg-indigo-700 animate-pulse" />
                ) : (
                  registrants.length
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 md:backdrop-blur-xl border border-emerald-500/40 dark:border-emerald-500/30 shadow-lg rounded-2xl p-3 md:p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl">
          <div className="animate-fadeInUp">
            <div className="flex items-center md:items-start justify-center md:justify-between mb-1 md:mb-3 min-h-10">
              <span className="text-[13px] text-center md:text-base font-semibold text-gray-600 dark:text-gray-400">
                Tervalidasi
              </span>
              <CheckCircle2 className="hidden md:block w-[22px] h-[22px] text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <CheckCircle2 className="md:hidden w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {loading ? (
                  <span className="inline-block h-9 w-16 rounded bg-emerald-200 dark:bg-emerald-700 animate-pulse" />
                ) : (
                  registrants.filter((r) => r.status === "validated").length
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/5 dark:bg-amber-500/10 md:backdrop-blur-xl border border-amber-500/40 dark:border-amber-500/30 shadow-lg rounded-2xl p-3 md:p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl">
          <div className="animate-fadeInUp">
            <div className="flex items-center md:items-start justify-center md:justify-between mb-1 md:mb-3 min-h-10">
              <span className="text-[13px] text-center md:text-base font-semibold text-gray-600 dark:text-gray-400">
                Belum Divalidasi
              </span>
              <Circle className="hidden md:block w-[22px] h-[22px] text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Circle className="md:hidden w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-lg md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                {loading ? (
                  <span className="inline-block h-9 w-16 rounded bg-amber-200 dark:bg-amber-700 animate-pulse" />
                ) : (
                  registrants.filter((r) => r.status === "unvalidated").length
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end flex-wrap animate-fadeInUp">
        <button
          onClick={() => exportRegistrantsToCSV(registrants)}
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
        {loading ? (
          <div
            key="skeleton"
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
                  <th className="px-3 py-3 md:px-6 md:py-4 text-center font-semibold">
                    Validasi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : registrants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/80 md:bg-white/60 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 dark:text-gray-500 text-sm animate-fadeInUp">
              Belum ada data pendaftar
            </p>
          </div>
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
                {paginatedRegistrants.map((registrant, index) => (
                  <tr
                    key={registrant._id || registrant.id}
                    className="transition-colors animate-fadeIn hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                  >
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {registrant.registrationNumber || "-"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formatCreatedDate(registrant.createdAt)}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formatCreatedDate(registrant.updatedAt)}
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
        {!loading && registrants.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={itemsPerPage}
            totalItems={registrants.length}
          />
        )}
      </div>
    </div>
  );
}

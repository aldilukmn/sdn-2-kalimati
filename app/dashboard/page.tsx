"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, CheckCircle2, Circle, LogOut } from "lucide-react";
import RegistrationService from "@/services/registration.service";
import AuthService from "@/services/auth.service";

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

interface ApiResponse {
  status: {
    code: number;
    response: string;
  };
  message?: string;
  result?: Registrant[];
  data?: Registrant[];
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

export default function Dashboard() {
  const router = useRouter();
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRegistrants = async () => {
      try {
        const response = await RegistrationService.getAll();

        const data = response.result || response.data || [];
        setRegistrants(data);
      } catch (err) {
        const error = err as Error & {
          status?: number;
        };

        if (error.status === 401) {
          router.replace("/");
          return;
        }

        setError(error.message || "Gagal memuat data pendaftar");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrants();
  }, [router]);

  const handleValidate = (id: string) => {
    setValidated((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      sessionStorage.removeItem("user_session");
      router.replace("/login");
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
            <div style="padding: 20px; margin-top: 20px; font-weight: bold; font-size: 16px; text-decoration: underline; text-underline-offset: 6px;">
              FORMULIR PENDAFTARAN ONLINE
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
                <div class="field-value">Anak ke-${registrant.student?.childOrder} dari ${registrant.student?.numberOfSiblings} bersaudara</div>
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
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data pendaftar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data pendaftar dan validasi formulir
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors dark:bg-red-700 dark:hover:bg-red-800"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Total Pendaftar
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {registrants.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Tervalidasi
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {validated.size}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Belum Divalidasi
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {registrants.length - validated.size}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {registrants.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada data pendaftar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      No. Pendaftaran
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tanggal Daftar
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
                      Cetak
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Validasi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {registrants.map((registrant, index) => (
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
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handlePrint(registrant)}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Cetak Formulir"
                        >
                          <Printer size={20} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleValidate(
                              registrant._id || registrant.id || "",
                            )
                          }
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                            validated.has(registrant._id || registrant.id || "")
                              ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                          }`}
                          title={
                            validated.has(registrant._id || registrant.id || "")
                              ? "Batalkan Validasi"
                              : "Validasi Data"
                          }
                        >
                          {validated.has(
                            registrant._id || registrant.id || "",
                          ) ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <span className="font-semibold">💡 Tips:</span> Klik ikon printer
            untuk mencetak formulir pendaftar, dan klik ikon lingkaran untuk
            mengubah status validasi data.
          </p>
        </div>
      </div>
    </div>
  );
}

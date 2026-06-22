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

const HEADERS = [
  "No. Pendaftaran",
  "Tanggal Daftar",
  "Tanggal Update",
  "Status Validasi",
  "Nama Lengkap",
  "NIK",
  "NISN",
  "No. KK",
  "Tempat Lahir",
  "Tanggal Lahir",
  "Jenis Kelamin",
  "Agama",
  "Anak Ke-",
  "Jumlah Saudara",
  "TK Asal",
  "Alamat",
  "RT",
  "RW",
  "Desa/Kelurahan",
  "Kecamatan",
  "Kode Pos",
  "No. HP",
  "Nama Ayah",
  "NIK Ayah",
  "Tahun Lahir Ayah",
  "Pendidikan Ayah",
  "Pekerjaan Ayah",
  "Penghasilan Ayah",
  "Nama Ibu",
  "NIK Ibu",
  "Tahun Lahir Ibu",
  "Pendidikan Ibu",
  "Pekerjaan Ibu",
  "Penghasilan Ibu",
  "Nama Wali",
  "Hubungan Wali",
  "No. HP Wali",
];

function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(dateStr);
  }
}

function wrap(value: unknown): string {
  const str = String(value ?? "-");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportRegistrantsToCSV(registrants: Registrant[]): void {
  const rows = registrants.map((r) => {
    const s = r.student || {};
    const a = s.address || {};
    const f = r.father || {};
    const m = r.mother || {};
    const g = r.guardian || {};

    const statusLabel =
      r.status === "validated"
        ? "Tervalidasi"
        : r.status === "unvalidated"
          ? "Belum Divalidasi"
          : "-";

    return [
      r.registrationNumber,
      formatDate(r.createdAt),
      formatDate(r.updatedAt),
      statusLabel,
      s.fullName,
      s.nik,
      s.nisn,
      s.noKk,
      s.birthPlace,
      s.birthDate ? formatDate(s.birthDate) : "-",
      s.gender,
      s.religion,
      s.childOrder,
      s.numberOfSiblings,
      s.kindergartenOrigin,
      a.street,
      a.rt,
      a.rw,
      a.village,
      a.district,
      a.postalCode,
      r.contactPhoneNumber,
      f.name,
      f.nik,
      f.birthYear,
      f.education,
      f.occupation,
      f.monthlyIncome,
      m.name,
      m.nik,
      m.birthYear,
      m.education,
      m.occupation,
      m.monthlyIncome,
      g.name,
      g.relationship,
      g.phoneNumber,
    ].map(wrap).join(",");
  });

  const bom = "\uFEFF";
  const csv = bom + HEADERS.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;bom" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `data-pendaftar-pmb-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

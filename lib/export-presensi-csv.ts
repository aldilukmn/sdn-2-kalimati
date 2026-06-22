interface PresensiRow {
  nisn: string;
  nama: string;
  kelas: string;
  tanggal: string;
  status: string;
}

const HEADERS = [
  "No",
  "NISN",
  "Nama Lengkap",
  "Kelas",
  "Tanggal",
  "Status",
];

function wrap(value: unknown): string {
  const str = String(value ?? "-");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportPresensiToCSV(
  data: PresensiRow[],
  label: string
): void {
  const rows = data.map((r, i) =>
    [
      i + 1,
      r.nisn,
      r.nama,
      `Kelas ${r.kelas}`,
      r.tanggal,
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
    ]
      .map(wrap)
      .join(",")
  );

  const bom = "\uFEFF";
  const csv = bom + HEADERS.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;bom",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `presensi-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

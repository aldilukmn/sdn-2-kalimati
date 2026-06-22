interface Presensi {
  nisn: string;
  nama: string;
  kelas: string;
  tanggal: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
  keterangan?: string;
}

interface PresensiHarian {
  tanggal: string;
  kelas: string;
  entries: Omit<Presensi, "kelas" | "tanggal">[];
}

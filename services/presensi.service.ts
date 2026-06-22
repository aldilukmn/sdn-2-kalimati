import { api } from "@/lib/api";

export default class PresensiService {
  static async create(data: PresensiHarian) {
    return await api("/presensi", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getByClass(kelas: string, tanggal: string) {
    return await api(`/presensi?kelas=${kelas}&tanggal=${tanggal}`);
  }

  static async getRekapByNisn(
    nisn: string,
    bulan?: number,
    tahun?: number
  ) {
    let query = `/presensi/rekap/${nisn}`;
    const params = new URLSearchParams();
    if (bulan) params.set("bulan", String(bulan));
    if (tahun) params.set("tahun", String(tahun));
    const qs = params.toString();
    if (qs) query += `?${qs}`;
    return await api(query);
  }
}

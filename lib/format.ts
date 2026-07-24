export function formatCompactRupiah(num: number): string {
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000)
    return `${sign}Rp ${abs / 1_000_000_000} M`;
  if (abs >= 1_000_000)
    return `${sign}Rp ${abs / 1_000_000} jt`;
  if (abs >= 1_000)
    return `${sign}Rp ${abs / 1_000} rb`;
  return `${sign}Rp ${abs}`;
}

export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatDateID(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${MONTHS_ID[parseInt(m) - 1]} ${y}`;
}

export const DAYS_ID = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export function formatDateWithDayID(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const dayName = DAYS_ID[dateObj.getDay()];
  return `${dayName}, ${parseInt(d)} ${MONTHS_ID[parseInt(m) - 1]} ${y}`;
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)}/${parseInt(m)}/${y.slice(2)}`;
}

export function getTodayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

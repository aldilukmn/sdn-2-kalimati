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

export function formatDateID(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export function formatCompactRupiah(num: number): string {
  if (num >= 1_000_000_000)
    return `Rp ${num / 1_000_000_000} M`;
  if (num >= 1_000_000)
    return `Rp ${num / 1_000_000} jt`;
  if (num >= 1_000)
    return `Rp ${num / 1_000} rb`;
  return `Rp ${num}`;
}

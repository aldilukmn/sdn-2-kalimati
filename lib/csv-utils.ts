export function wrap(value: unknown): string {
  const str = String(value ?? "-");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCSV(
  headers: string[],
  rows: string[],
  filename: string
): void {
  const bom = "\uFEFF";
  const csv = bom + headers.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;bom" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

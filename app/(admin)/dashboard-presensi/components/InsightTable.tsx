import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InsightTable({
  title,
  icon,
  headerClass,
  hoverClass,
  rows,
  col3Label,
  col3Value,
  col4Value,
}: {
  title: string;
  icon: React.ReactNode;
  headerClass: string;
  hoverClass: string;
  rows: {
    studentId: string;
    name: string;
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
    total: number;
    hadirRate: number;
  }[];
  col3Label: string;
  col3Value: (r: (typeof rows)[0]) => { val: string | number; cls: string };
  col4Value: (r: (typeof rows)[0]) => { val: string | number; cls: string };
}) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className={`bg-gradient-to-r ${headerClass} text-white`}>
              <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
              <TableHead className="text-xs font-semibold text-white">Nama Murid</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white w-14">{col3Label}</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white w-16">Hadir %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => {
                const c3 = col3Value(row);
                const c4 = col4Value(row);
                return (
                  <TableRow key={row.studentId} className={`${hoverClass} transition-colors`}>
                    <TableCell className="text-center text-xs text-slate-500">{i + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{row.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-bold ${c3.cls}`}>{c3.val}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-bold ${c4.cls}`}>{c4.val}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

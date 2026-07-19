import { UserMinus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DailyPresensiView({
  topAbsen,
}: {
  topAbsen: {
    studentId: string;
    name: string;
    hadir: number;
    sakit: number;
    izin: number;
    absen: number;
    total: number;
    hadirRate: number;
  }[];
}) {
  return (
    <div className="bg-white/90 md:bg-white/70 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/50 shadow-lg rounded-2xl p-4 md:p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <UserMinus size={16} className="text-red-500 dark:text-red-400 shrink-0" />
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Murid Tidak Hadir Hari Ini
        </h3>
      </div>
      <div className="overflow-x-auto animate-fadeIn rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <TableHead className="w-10 text-center text-xs font-semibold text-white">No</TableHead>
              <TableHead className="text-xs font-semibold text-white">Nama Murid</TableHead>
              <TableHead className="text-center text-xs font-semibold text-white w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAbsen.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-sm text-emerald-500 dark:text-emerald-400 font-medium">
                  🎉 Semua murid hadir!
                </TableCell>
              </TableRow>
            ) : (
              topAbsen.map((row, i) => (
                <TableRow
                  key={row.studentId}
                  className="hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <TableCell className="text-center text-xs text-slate-500">{i + 1}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      {row.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {(() => {
                      const label = row.absen > 0 ? "Alpa" : row.sakit > 0 ? "Sakit" : "Izin";
                      const colors = row.absen > 0
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : row.sakit > 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
                      return (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

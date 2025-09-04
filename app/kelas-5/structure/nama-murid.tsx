import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

export default function NamaMurid() {
  const siswa = [
    "Alya Ramadhani",
    "Bima Pratama",
    "Citra Lestari",
    "Daffa Nugroho",
    "Elisa Putri",
    "Fahriansyah",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h1 className="text-xl font-bold mb-6">Daftar Nama Murid Kelas 5</h1>

      <Table striped hoverable>
        <TableHead>
          <TableHeadCell>No</TableHeadCell>
          <TableHeadCell>Nama Siswa</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableHead>

        <TableBody className="divide-y">
          {siswa.map((nama, i) => (
            <TableRow
              key={i}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {i + 1}
              </TableCell>
              <TableCell>{nama}</TableCell>
              <TableCell>
                <span className="text-green-600 font-semibold">Aktif</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

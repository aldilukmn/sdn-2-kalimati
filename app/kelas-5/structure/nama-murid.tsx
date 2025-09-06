"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { siswa } from "../data";

const PAGE_SIZE = 5;

export default function NamaMurid() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(siswa.length / PAGE_SIZE);

  const startIdx = (page - 1) * PAGE_SIZE;
  const currentData = siswa.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col py-6 overflow-x-auto">
        <h1 className="text-xl font-bold mb-6 text-center tracking-wider">Daftar Nama Murid</h1>
        <Table striped hoverable>
          <TableHead>
            <TableHeadCell>No</TableHeadCell>
            <TableHeadCell>NISN</TableHeadCell>
            <TableHeadCell>NIS</TableHeadCell>
            <TableHeadCell>Nama Siswa</TableHeadCell>
            <TableHeadCell>Jenis Kelamin</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {currentData.map((data, i) => (
              <TableRow
                key={startIdx + i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {startIdx + i + 1}
                </TableCell>
                <TableCell>{data.nisn}</TableCell>
                <TableCell>{data.nis}</TableCell>
                <TableCell>{data.nama}</TableCell>
                <TableCell>{data.jk}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-semibold">Aktif</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
            <div className="flex gap-2 mt-4 place-self-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="py-1">
          Halaman {page} dari {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

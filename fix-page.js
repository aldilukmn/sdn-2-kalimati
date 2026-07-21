const fs = require('fs');
let page = fs.readFileSync('app/(admin)/penilaian/page.tsx', 'utf8');

page = page.replace('import { useTugas } from "@/hooks/usePenilaian";', 'import { usePenilaian } from "@/hooks/usePenilaian";\nimport { useState } from "react";');
page = page.replace('export default function NilaiTugasPage() {', 'export default function PenilaianPage() {\n  const [category, setCategory] = useState("tugas");');
page = page.replace('const {', 'const {');
page = page.replace('} = useTugas();', '} = usePenilaian(category);');

page = page.replace(/title="Nilai Tugas"/g, 'title="Penilaian"');
page = page.replace(/title="Daftar Tugas"/g, 'title={`Daftar ${category === "tugas" ? "Tugas" : category === "keaktifan" ? "Keaktifan" : category}`}');

page = page.replace(/description="Klik Tambah Tugas untuk membuat tugas baru"/g, 'description={`Klik Tambah ${category === "tugas" ? "Tugas" : category === "keaktifan" ? "Keaktifan" : category} untuk membuat data baru`}');

page = page.replace(/title=\{taskModal\?\.mode === "add" \? "Tambah Tugas" : "Edit Tugas"\}/g, 'title={taskModal?.mode === "add" ? `Tambah ${category === "tugas" ? "Tugas" : category === "keaktifan" ? "Keaktifan" : category}` : "Edit Data"}');

page = page.replace(/Input Nilai Tugas:/g, 'Input Nilai:');
page = page.replace(/Rerata Nilai Tugas/g, 'Rerata Nilai');
page = page.replace(/"Belum ada tugas"/g, '"Belum ada data"');

// Replace FilterBar with Category selector + FilterBar
const filterBarStr = '<FilterBar\n          semester={semester}';
const newFilterBar = `<div className="flex items-center gap-4 mb-4">
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer">
            <option value="tugas">Tugas</option>
            <option value="keaktifan">Keaktifan</option>
          </select>
        </div>
        <FilterBar
          semester={semester}`;
page = page.replace(filterBarStr, newFilterBar);

fs.writeFileSync('app/(admin)/penilaian/page.tsx', page);

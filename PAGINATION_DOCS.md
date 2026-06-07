# Dokumentasi Pagination Dashboard

## 📋 Ringkasan Perubahan

Pagination telah berhasil ditambahkan ke halaman dashboard dengan konfigurasi:
- **Items per halaman**: 2 data
- **Contoh**: Jika ada 6 data pendaftar:
  - Halaman 1: Data 1-2
  - Halaman 2: Data 3-4
  - Halaman 3: Data 5-6

## 📁 File yang Dibuat/Diubah

### File Baru:
1. **`app/components/Pagination.tsx`** - Komponen Pagination yang reusable

### File yang Dimodifikasi:
1. **`app/dashboard/page.tsx`** - Integrasi pagination ke dashboard

## 🔧 Implementasi Detail

### 1. Komponen Pagination (`app/components/Pagination.tsx`)

Komponen ini menyediakan:
- Tombol navigasi Previous/Next
- Nomor halaman yang interaktif
- Indikator halaman saat ini
- Info jumlah data yang ditampilkan
- Styling konsisten dengan design dashboard

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;           // Halaman saat ini
  totalPages: number;            // Total halaman
  onPageChange: (page: number) => void;  // Callback saat halaman berubah
  itemsPerPage?: number;         // Jumlah item per halaman (default: 2)
  totalItems?: number;           // Total jumlah item
}
```

### 2. Integrasi di Dashboard

Perubahan di `app/dashboard/page.tsx`:

**Import:**
```typescript
import Pagination from "@/app/components/Pagination";
```

**State:**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 2;
```

**Logika Pagination:**
```typescript
const totalPages = Math.ceil(registrants.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedRegistrants = registrants.slice(startIndex, endIndex);
```

**Rendering Tabel:**
```typescript
{paginatedRegistrants.map((registrant, index) => (
  // Render row
))}
```

**Komponen Pagination:**
```typescript
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={registrants.length}
/>
```

## 🎨 Fitur Pagination

1. **Navigasi Halaman**
   - Tombol Previous/Next untuk navigasi antar halaman
   - Tombol nomor halaman untuk jump langsung

2. **Indikator Status**
   - Tombol Previous/Next disabled saat di halaman pertama/akhir
   - Highlight halaman yang sedang aktif
   - Teks info "Halaman X dari Y"

3. **Info Data**
   - Menampilkan "Menampilkan 1-2 dari 6 data"
   - Otomatis update sesuai pagination

4. **Styling**
   - Menggunakan Tailwind CSS konsisten dengan dashboard
   - Dark mode support
   - Responsive design

## 🚀 Cara Menggunakan

### Di Komponen Lain (Reusable)

```typescript
import Pagination from "@/app/components/Pagination";
import { useState } from "react";

export default function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const data = [...]; // Your data array

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Display paginatedData */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />
    </>
  );
}
```

### Mengubah Items Per Halaman

Di `app/dashboard/page.tsx`, ubah nilai `itemsPerPage`:

```typescript
const itemsPerPage = 5;  // Ubah dari 2 menjadi 5
```

## ✅ Testing

Build berhasil dengan output:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
```

Tidak ada error atau warning pada kompilasi.

## 📝 Notes

- Pagination hanya muncul jika `registrants.length > 0`
- Semua data tetap tersimpan di state, pagination hanya mengubah tampilan
- Logika validasi dan print tetap bekerja dengan baik
- Design konsisten dengan dashboard yang sudah ada

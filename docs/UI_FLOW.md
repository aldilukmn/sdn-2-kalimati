# User Flow — Frontend Modul Penilaian

## 1. Menu Navigasi

**Sidebar (role-based):**

| Menu | Icon | Role | Halaman |
|------|------|------|---------|
| Dashboard | 📊 | Semua | Ringkasan kelas |
| Data Master | ⚙️ | Admin | Kelola mata pelajaran & kelas |
| Struktur Akademik | 📚 | Admin | Atur bab & materi tiap mapel |
| Nilai Harian | 📝 | Guru | Input nilai per bab/materi |
| Nilai Komponen | 📋 | Guru | Input ASTS/ASAS/Proyek |
| Nilai Akhir | 🏆 | Semua | Lihat & hitung nilai akhir |
| Konfigurasi Penilaian | ⚖️ | Admin | Atur bobot komponen |

**Top bar:**
- User info (nama, role)
- Filter: Semester & Tahun Ajaran (global dropdown)
- Logout

---

## 2. Alur Pengguna

### Alur Admin (setup awal)

```
Dashboard
  │
  ├── 1. Data Master → Mata Pelajaran → Tetapkan ke Kelas
  │         (buat daftar mapel + tetapkan ke kelas)
  │
  ├── 2. Struktur Akademik → Pilih Mapel → Bab
  │         (buat daftar bab + tentukan metode input)
  │         └── Pilih Bab → Materi (jika metode = Per Materi)
  │
  └── 3. Konfigurasi Penilaian → Pilih Kelas
           (atur komponen + bobot → submit + lihat preview rumus)
```

### Alur Guru (setiap hari/semester)

```
Dashboard (lihat progress semua mapel)
  │
  ├── Klik card mapel / menu "Nilai Harian"
  │     │
  │     ├── Pilih mapel (tab atau card)
  │     │
  │     ├── Lihat daftar bab (card dengan progress bar)
  │     │
  │     ├── Klik bab
  │     │     ├── Per Bab → langsung input nilai (tabel)
  │     │     └── Per Materi → pilih materi via tab, lalu input nilai
  │     │
  │     └── Progress bar update real-time
  │
  ├── Nilai Komponen
  │     ├── Pilih Mapel
  │     ├── Pilih Komponen (asts/asas/proyek) via tab
  │     └── Input nilai semua siswa
  │
  └── Nilai Akhir
        ├── Lihat ringkasan (lengkap vs belum)
        ├── Jika bobot berubah → lihat summary → "Hitung Ulang"
        └── Jika lengkap → lihat rekap nilai
```

---

## 3. Route Structure

| Path | Page | Role |
|------|------|------|
| `/` | Dashboard | Semua |
| `/admin/subjects` | Data Master (Mapel + Kelas) | Admin |
| `/admin/curriculum` | Struktur Akademik (Bab + Materi) | Admin |
| `/admin/assessment-config` | Konfigurasi Penilaian | Admin |
| `/daily-scores` | Nilai Harian | Guru |
| `/assessment-scores` | Nilai Komponen | Guru |
| `/final-scores` | Nilai Akhir | Semua |

**Global State:**
- `selectedGrade` — dari user login atau pilihan
- `selectedSemester` — default semester aktif
- `selectedAcademicYear` — default TA aktif

---

## 4. Detail Halaman & Komponen

### A. Dashboard (Guru) ⭐

**Route:** `/`

Dashboard guru sebagai **command center** — lihat progress semua mapel dalam satu layar.

```
┌───────────────────────────────────────────────────────────────┐
│  Selamat datang, Bu Guru Ani                                  │
│  Kelas 1 — Semester 1 — TA 2025/2026                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 📐 Matematika                         🟡  65%          │ │
│  │ ████████████████░░░░░░░░░░░░░░░░░░░░░░                  │ │
│  │ Bab selesai: 5 / 8    •    30 / 30 siswa sudah dinilai  │ │
│  │                                                         │ │
│  │ Bab belum selesai:                                      │ │
│  │ • Pecahan (60%)                                         │ │
│  │ • Statistika (0%)                                       │ │
│  │                                                         │ │
│  │                         [Lanjut Input]                  │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 📖 Bahasa Indonesia                   🟢  100% ✅       │ │
│  │ ████████████████████████████████████████                │ │
│  │ Bab selesai: 6 / 6    •    30 / 30 siswa sudah dinilai  │ │
│  │                                                         │ │
│  │ Semua bab sudah selesai.                                │ │
│  │                         [Lihat Nilai Akhir]             │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 🔬 IPA                                   🔴  40%       │ │
│  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░               │ │
│  │ Bab selesai: 2 / 5    •    24 / 30 siswa sudah dinilai  │ │
│  │                                                         │ │
│  │ Bab belum selesai:                                      │ │
│  │ • Gerak Benda (40%)                                     │ │
│  │ + 2 lagi                                                │ │
│  │                                                         │ │
│  │                         [Lanjut Input]                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Status Nilai Akhir: ⚠️ Belum dihitung  [Hitung Sekarang]    │
└───────────────────────────────────────────────────────────────┘
```

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Greeting + info kelas | Text | Nama guru, kelas, semester, TA |
| Subject Card × N | Card grid | Satu card per subject |
| **Color dot** | **In-card (pojok)** | **🔴 abu = 0%, 🟡 kuning = 1–99%, 🟢 hijau = 100% — scanning cepat tanpa baca angka** |
| Progress bar | In-card | Warna: hijau (100%), kuning (1–99%), abu (0%) |
| **Info bab selesai** | **In-card** | **"Bab selesai: X / Y" — jumlah bab yang sudah dinilai semua siswa / total** |
| **Info siswa sudah dinilai** | **In-card** | **"30 / 30 siswa sudah dinilai" — siswa yang punya nilai di semua bab / total siswa. Jelas tanpa tebak-tebak.** |
| Daftar chapter belum selesai | In-card | Max 3 + "...N lagi" |
| Tombol "Lanjut Input" | In-card | Navigasi ke halaman Nilai Harian mapel terkait |
| Status Nilai Akhir | Banner bottom | "✅ Sudah dihitung" / "⚠️ Belum dihitung" / "🔄 Bobot telah berubah" |

**Skeleton loading saat load data:**

```
┌───────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓                        ▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓                        ▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓                        ▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

### B. Data Master (Admin Only)

**Route:** `/admin/subjects`

#### Tab 1 — Daftar Mata Pelajaran

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Tabel | Halaman penuh | Kolom: No, Nama Mapel, Aksi |
| Tombol "Tambah" | Trigger modal | Modal: input nama + simpan |
| Tombol "Ubah" | Inline | Modal: ubah nama |
| Tombol "Hapus" | Inline | Konfirmasi hapus (diblok jika masih dipakai) |

**Empty state:**

```
┌─────────────────────────────────────┐
│  📂                                 │
│                                     │
│  Belum ada Mata Pelajaran.          │
│                                     │
│  Silakan tambahkan Mata Pelajaran   │
│  terlebih dahulu.                   │
│                                     │
│  [Tambah Mata Pelajaran]            │
└─────────────────────────────────────┘
```

#### Tab 2 — Tetapkan ke Kelas

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Filter | Inline | Kelas, Semester, TA |
| Tabel | Halaman penuh | Kolom: No, Mapel, Kelas, Semester, TA, Aksi |
| Tombol "Tetapkan" | Trigger modal | Modal: pilih mapel + kelas + semester + TA |

**Empty state:**

```
┌───────────────────────────────────────────┐
│  📂                                       │
│                                           │
│  Belum ada Mata Pelajaran yang            │
│  ditetapkan ke kelas ini.                 │
│                                           │
│  [Tetapkan Mata Pelajaran]                │
└───────────────────────────────────────────┘
```

---

### C. Struktur Akademik (Admin Only)

**Route:** `/admin/curriculum`

#### Halaman Bab

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Dropdown Mapel | Filter | Hanya untuk kelas yang dipilih di topbar |
| Tombol "Tambah Bab" | Trigger modal | Modal: nama, metode input (Per Bab / Per Materi) |
| Daftar accordion | Halaman penuh | Setiap bab adalah accordion |
| Gagang seret | Inline | Urutkan via seret & lepas |
| Aksi: Ubah, Hapus, "Lihat Materi" | Inline | Per item |
| Label metode input | Badge | `Per Bab` / `Per Materi` |
| Modal Ubah | Modal | Ubah nama, metode input (diblok jika sudah ada nilai) |
| Konfirmasi hapus | Dialog | Diblok jika masih ada nilai |

**Empty state:**

```
┌───────────────────────────────────────┐
│  📂                                   │
│                                       │
│  Belum ada Bab.                       │
│                                       │
│  Silakan buat Bab terlebih dahulu     │
│  untuk mata pelajaran ini.            │
│                                       │
│  [Tambah Bab]                         │
└───────────────────────────────────────┘
```

#### Halaman Materi (tampilkan detail)

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Breadcrumb | Atas | Struktur Akademik → Mapel → Bab |
| Daftar bisa diurutkan | Halaman penuh | Urutan materi |
| Tombol "Tambah Materi" | Trigger modal | Input nama |
| Gagang seret | Inline | Urutkan |
| Ubah / Hapus | Inline | Modal ubah / konfirmasi hapus |

**Empty state:**

```
┌──────────────────────────────────────────────┐
│  📂                                          │
│                                              │
│  Bab ini belum memiliki Materi.              │
│                                              │
│  Silakan tambahkan Materi terlebih dahulu.   │
│                                              │
│  [Tambah Materi]                             │
└──────────────────────────────────────────────┘
```

---

### D. Nilai Harian (Guru) ⭐

**Route:** `/daily-scores`

Halaman paling penting — prioritas kecepatan input.

**Layout — dua bagian: daftar bab (atas) + tabel input (bawah).**

```
┌───────────────────────────────────────────────────────────────┐
│  Mapel: [Matematika ▼]                                        │
│                                                               │
│  ┌─── BAB ───────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  📘 Bab 1: Bilangan              [Per Materi] 100% ✅│   │
│  │  ████████████████████████████████████████████████     │   │
│  │  (Sedang aktif)                                       │   │
│  │                                                       │   │
│  │  📘 Bab 2: Pecahan               [Per Bab]   60%     │   │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      │   │
│  │  Klik untuk input                                   │   │
│  │                                                       │   │
│  │  📘 Bab 3: Bangun Datar            [Per Bab]   0%    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      │   │
│  │  Klik untuk input                                   │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─── Bab 1: Bilangan (Per Materi) ───────────────────────┐  │
│  │  [Materi A]  [Materi B]  [Materi C]                    │  │
│  │                                                         │  │
│  │  ┌─────── TABEL NILAI ────────────────────────────┐   │  │
│  │  │ No │ Nama     │ Nilai │ Maks │ Status          │   │  │
│  │  │────┼──────────┼───────┼──────┼─────────────────│   │  │
│  │  │ 1  │ Ani      │ [ 85 ]│ 100  │ ✅ Tersimpan    │   │  │
│  │  │ 2  │ Budi     │ [ 90 ]│ 100  │ ✅ Tersimpan    │   │  │
│  │  │ 3  │ Cici     │ [    ]│ 100  │ ⏳ Belum simpan │   │  │
│  │  │ .. │          │       │      │                  │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  [💾 Simpan Semua]                                      │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Pemilih Mapel | Tab bar | Ganti mapel tanpa reload halaman |
| Daftar Bab | Card list | Setiap bab = card dengan progress bar. Klik → aktifkan |
| **Badge metode input** | **In-card** | **`[Per Bab]` / `[Per Materi]` — badge kecil di samping nama bab agar guru tahu metode tanpa perlu klik** |
| Progress bar | In-card | `jumlah siswa sudah dinilai / total siswa × 100%` |
| Tab Materi | Tab bar | Horizontal, muncul hanya jika bab metode Per Materi. Ganti materi tanpa reload |
| Tabel Nilai | Halaman penuh | Input langsung di tiap baris |
| Input Nilai | Text field (numeric) | Tab → baris berikutnya, Enter → simpan & lanjut |
| Indikator status | Ikon per baris | ✅ Tersimpan / ⏳ Belum simpan / ❌ Gagal |
| Tombol "Simpan Semua" | Primary | Simpan semua nilai (POST /scores/bulk) |
| **Toast feedback** | **Snackbar** | **Setelah simpan: `✅ 30 nilai berhasil disimpan` (hijau, 3 detik) atau `⚠️ 28 berhasil, 2 gagal` (kuning, 5 detik, dengan tombol "Lihat detail")** |

**Empty state (belum ada bab untuk dinilai):**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Belum ada Bab yang dapat dinilai.            │
│                                               │
│  Hubungi Admin untuk membuat Struktur         │
│  Akademik terlebih dahulu.                    │
└───────────────────────────────────────────────┘
```

**Empty state (bab aktif, tapi materi kosong untuk mode Per Materi):**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Bab ini belum memiliki Materi.               │
│                                               │
│  Silakan pilih bab lain atau hubungi Admin    │
│  untuk menambahkan Materi.                    │
└───────────────────────────────────────────────┘
```

**Skeleton loading saat load data:**

```
┌───────────────────────────────────────────────────────────┐
│  ┌─── BAB ───────────────────────────────────────────┐   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓  │ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓  │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │   │
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─── TABLE ──────────────────────────────────────────┐  │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓  │  │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓  │  │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓  │  │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓  │  │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

**Skeleton terdiri dari: 3–4 card chapter + 5–6 baris tabel. Animasi pulse pada seluruh elemen.**

**Fitur akselerasi:**

| # | Fitur | Detail |
|---|-------|--------|
| 1 | **Pilih otomatis** | Mapel/bab pertama yang belum penuh otomatis terpilih |
| 2 | **Navigasi Tab** | Tab = pindah ke siswa berikutnya |
| 3 | **Enter = simpan** | Enter = simpan & lanjut |
| 4 | **Isi otomatis** | Nilai sebelumnya tampil dan bisa diedit |
| 5 | **Isi Semua** | Tombol → input nilai → terapkan ke semua siswa |
| 6 | **Warna status** | Hijau = Tersimpan, Kuning = Belum simpan, Merah = Gagal |
| 7 | **Ctrl+S** | Pintasan simpan dari mana saja |
| 8 | **Header tetap** | Header kolom tetap terlihat saat scroll |

---

### E. Nilai Komponen / ASTS-ASAS (Guru)

**Route:** `/assessment-scores`

```
┌───────────────────────────────────────────────────────────────┐
│  Mapel: [Matematika ▼]                                        │
│                                                               │
│  Konfigurasi Aktif: Nilai Akhir = Harian×70% + ASTS×15% +    │
│                     ASAS×15%                                  │
│                                                               │
│  Komponen:  [ASTS]  [ASAS]                                    │
│                                                               │
│  ┌─────── TABEL NILAI ──────────────────────────────────┐   │
│  │ No │ Nama     │ Nilai ASTS  │ Status                 │   │
│  │────┼──────────┼─────────────┼────────────────────────│   │
│  │ 1  │ Ani      │ [ 85 ]      │ ✅ Tersimpan           │   │
│  │ 2  │ Budi     │ [    ]      │ ⏳ Belum simpan        │   │
│  │ .. │          │             │                         │   │
│  │    │          │             │                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  [💾 Simpan Semua]                                            │
└───────────────────────────────────────────────────────────────┘
```

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Pemilih Mapel | Dropdown | — |
| Pratinjau rumus | Info card | `Nilai Akhir = {nama}×{bobot}% + ...` (real-time) |
| Tab Komponen | Tab bar | Komponen non-harian dari konfigurasi aktif |
| Tabel Nilai | Halaman penuh | Sama seperti Nilai Harian |
| Tombol Simpan | Primary | POST /assessment-scores/bulk |
| **Toast feedback** | **Snackbar** | **Sama seperti Nilai Harian: `✅ N nilai berhasil disimpan`** |

**Skeleton loading saat load data:**

```
┌───────────────────────────────────────────────────────────┐
│  ┌─── TABLE ─────────────────────────────────────────┐   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓    │   │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

**Skeleton terdiri dari 5–6 baris tabel dengan animasi pulse.**

**Empty state (belum ada konfigurasi penilaian aktif):**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Belum ada Konfigurasi Penilaian aktif.       │
│                                               │
│  Hubungi Admin untuk membuat Konfigurasi      │
│  Penilaian terlebih dahulu.                   │
└───────────────────────────────────────────────┘
```

**Empty state (bab selesai, nilai komponen belum diisi):**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Semua bab sudah dinilai.                     │
│                                               │
│  Sekarang masukkan nilai komponen lainnya     │
│  (ASTS, ASAS, Proyek, dll).                   │
│                                               │
│  Pilih komponen dari tab di atas untuk mulai. │
└───────────────────────────────────────────────┘
```

**Perbedaan dengan Nilai Harian:**
- Tidak ada pemilih bab/materi
- Komponen dari konfigurasi (asts, asas, proyek, dll) dalam bentuk tab
- Rentang nilai 0–100
- Pratinjau rumus sebagai informasi bobot

---

### F. Konfigurasi Penilaian (Admin Only)

**Route:** `/admin/assessment-config`

#### Halaman Daftar Konfigurasi

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Filter | Dropdown kelas | Pilih kelas |
| Tabel | Halaman penuh | Kolom: Kelas, Semester, TA, Komponen, Status, Aksi |
| Tombol "Buat Konfigurasi" | Trigger modal | — |

#### Modal Create/Edit Config

```
┌───────────────────────────────────────────────────────────────┐
│  ✏️ Buat Konfigurasi Penilaian                                 │
│                                                               │
│  Kelas: [1 ▼]  Semester: [1 ▼]  TA: [2025/2026 ▼]            │
│                                                               │
│  Komponen Penilaian:                                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Kode          │ Nama          │ Bobot (%)              │  │
│  │───────────────┼───────────────┼────────────────────────│  │
│  │ [harian     ] │ [Nilai Harian]│ [ 70 ]          🗑    │  │
│  │ [asts       ] │ [ASTS       ] │ [ 15 ]          🗑    │  │
│  │ [asas       ] │ [ASAS       ] │ [ 15 ]          🗑    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  [+ Tambah Komponen]                                          │
│                                                               │
│  Total Bobot: 100% ✅                                          │
│                                                               │
│  ┌── Pratinjau Rumus ─────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Nilai Akhir =                                          │   │
│  │    Nilai Harian × 70%                                   │   │
│  │  + ASTS × 15%                                           │   │
│  │  + ASAS × 15%                                           │   │
│  │                                                         │   │
│  │  *Komponen dengan nilai 0 akan diabaikan.               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                               │
│  [Batal]                              [Simpan]                │
└───────────────────────────────────────────────────────────────┘
```

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Kelas/Semester/TA | Dropdown | Hanya saat buat baru |
| Baris komponen dinamis | Daftar | Kode (teks), Nama (teks), Bobot (angka 0–100), Tombol hapus |
| Tombol "Tambah Komponen" | Trigger | Tambah baris kosong |
| Indikator total bobot | Live counter | Hijau = 100%, Merah ≠ 100% |
| **Pratinjau rumus** | **Info card** | **Real-time, berubah saat bobot diedit** |
| Tombol Simpan | Disabled | Nonaktif jika total ≠ 100 |

**Aturan:**
- Kode `"harian"` reserved — harus ada di konfigurasi
- Semua kode harus unik
- Total bobot harus 100%

**Empty state:**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Belum ada Konfigurasi Penilaian.             │
│                                               │
│  Buat konfigurasi penilaian agar guru dapat   │
│  menghitung Nilai Akhir Semester.             │
│                                               │
│  [Buat Konfigurasi]                           │
└───────────────────────────────────────────────┘
```

---

### G. Nilai Akhir (Semua Role)

**Route:** `/final-scores`

```
┌───────────────────────────────────────────────────────────────┐
│  Filter: [Kelas ▼]  [Mapel ▼ opsional]  [Semester ▼] [TA]    │
│                                                               │
│  ┌── Ringkasan ──────────────────────────────────────────┐   │
│  │                                                        │   │
│  │  📐 Matematika — 30 Siswa                              │   │
│  │                                                        │   │
│  │  ✅ Lengkap       : 25 siswa                           │   │
│  │  ⚠️ Belum lengkap : 5 siswa                            │   │
│  │      - ASTS  : 3 siswa belum diisi                     │   │
│  │      - ASAS  : 2 siswa belum diisi                     │   │
│  │                                                        │   │
│  │  Terakhir dihitung: 07 Juli 2026, 14.32 WIB            │   │
│  │                                                        │   │
│  │  [🔄 Hitung Ulang]                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────── TABEL NILAI ───────────────────────────────┐   │
│  │ No │ Siswa  │ Mapel   │ Komponen              │Nilai  │   │
│  │────┼────────┼─────────┼───────────────────────┼───────│   │
│  │ 1  │ Ani    │ Mat     │ harian:82, asts:85.. │ 84    │   │
│  │ 2  │ Budi   │ Mat     │ harian:90, asts:80.. │ 88    │   │
│  │ .. │        │         │                       │       │   │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

| Komponen | Jenis | Detail |
|----------|-------|--------|
| Filter | Form inline | Kelas, Mapel (opsional), Semester, TA |
| **Panel ringkasan** | **Info card** | **Jumlah siswa, ✅ lengkap, ⚠️ belum lengkap (per komponen)** |
| **Info terakhir dihitung** | **In-card** | **Dari data perhitungan — `Terakhir dihitung: {tanggal}, {jam} WIB`** |
| Banner peringatan | Alert (kuning) | Muncul jika bobot telah berubah, teks: "Bobot penilaian telah berubah. Silakan hitung ulang." |
| Tabel Nilai | Halaman penuh | Baris dapat diperluas — klik ➡ detail per komponen |
| Detail perluasan | Sub-tabel | Kode, nilai asli, bobot, nilai terbobot |
| Indikator belum lengkap | Label | "⚠️ {n} komponen belum diisi" jika nilai akhir = null |
| Tombol "Hitung Ulang" | Primary | POST /final-scores/calculate |

**Skeleton loading saat load data:**

```
┌───────────────────────────────────────────────────────────┐
│  ┌── Ringkasan ───────────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─── TABLE ─────────────────────────────────────────┐   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │   │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

**Skeleton terdiri dari: panel ringkasan (1 card) + 5–6 baris tabel. Animasi pulse.**

**Empty state (belum pernah dihitung):**

```
┌───────────────────────────────────────────────────────┐
│  📂                                                   │
│                                                       │
│  Belum ada Nilai Akhir yang dapat ditampilkan.        │
│                                                       │
│  Pastikan Nilai Harian dan Nilai Komponen sudah       │
│  lengkap, kemudian lakukan Hitung Nilai Akhir.        │
│                                                       │
│  [Hitung Sekarang]                                    │
└───────────────────────────────────────────────────────┘
```

**Empty state (tidak ada data filter):**

```
┌───────────────────────────────────────────────┐
│  📂                                           │
│                                               │
│  Tidak ada Nilai Akhir untuk filter ini.      │
│                                               │
│  Coba ubah filter kelas, mapel, semester,     │
│  atau tahun ajaran.                           │
└───────────────────────────────────────────────┘
```

**Kondisi tampilan:**
- Belum pernah dihitung → panel ringkasan + tombol "Hitung" aktif
- Bobot telah berubah → banner kuning + tombol "Hitung Ulang" aktif
- Nilai akhir = null → tampilkan "—" dengan keterangan komponen yang belum diisi
- Semua lengkap → tampilkan nilai akhir (angka)

---

## 5. Modal vs Drawer vs Halaman Terpisah

| Skenario | Keputusan | Alasan |
|----------|-----------|--------|
| Tambah/Ubah Mapel | **Modal** | Input 1 field, tidak perlu navigasi |
| Tetapkan ke Kelas | **Modal** | 4 dropdown, cukup modal |
| Tambah/Ubah Bab | **Modal** | 2-3 field, cukup modal |
| Tambah/Ubah Materi | **Modal** | 2 field, cukup modal |
| Buat/Ubah Konfigurasi | **Modal (besar)** | Daftar dinamis + pratinjau rumus, perlu ruang |
| Input Nilai (Harian/ASTS) | **Halaman terpisah** | Tabel penuh perlu layar maksimal |
| Lihat Nilai Akhir | **Halaman terpisah** | Tabel besar, filter, tombol aksi |
| Konfirmasi hapus | **Dialog (alert)** | "Yakin ingin menghapus?" |
| Urutkan Bab/Materi | **Inline (seret & lepas)** | Langsung di daftar, tanpa pindah konteks |
| Ubah nilai langsung | **Inline (input field)** | Langsung di tabel |
| Detail komponen nilai akhir | **Perluas baris** | Lihat detail tanpa pindah halaman |

**Aturan umum:**
- **Modal** untuk form input kecil (≤5 field) atau form isian (konfigurasi)
- **Halaman terpisah** untuk tabel + filter + aksi (input nilai, nilai akhir)
- **Panel samping (drawer)** tidak digunakan — tidak ada skenario yang cocok
- **Seret & lepas** untuk urutkan — lebih cepat dari modal input angka

---

## 6. Fitur Akselerasi Input

**Prinsip: "2 klik dari dashboard ke input nilai"**
```
Dashboard → Klik card mapel → Klik card bab → Input
```

| Fitur | Deskripsi |
|-------|-----------|
| **Navigasi berbasis card** | Bab sebagai card, bukan dropdown — lihat semua tanpa klik |
| **Progress bar** | Visual progress per bab — tahu status tanpa harus buka |
| **Navigasi Tab** | Tab = pindah ke input siswa berikutnya. Shift+Tab = mundur |
| **Enter = simpan** | Enter = simpan & lanjut ke baris berikutnya |
| **Isi otomatis** | Nilai sebelumnya tampil dan bisa diedit |
| **Isi Semua** | Tombol → input nilai → terapkan ke semua siswa |
| **Warna status** | Hijau = Tersimpan, Kuning = Belum simpan, Merah = Gagal |
| **Ctrl+S** | Pintasan simpan dari mana saja |
| **Header tetap** | Header kolom tetap terlihat saat scroll |
| **Pilih otomatis** | Mapel/bab/materi pertama yang belum penuh otomatis terpilih |
| **Toast notifikasi** | Snackbar 3 detik setelah simpan: `✅ 30 nilai berhasil disimpan` |
| **Lanjutkan otomatis** | Tanpa UI — `lastSubjectId` + `lastChapterId` di localStorage. Saat buka halaman input, langsung arahkan ke posisi terakhir |

**Layout mobile (card-style):**

```
┌────────────────────────────┐
│ 📘 Bab 1: Bilangan  [PerM] │
│ ████████████████████████   │
│                           │
│ No 1: Ani                 │
│ Nilai: [ 85 ]  ✅         │
│───────────────────────────│
│ No 2: Budi                │
│ Nilai: [ 90 ]  ✅         │
│───────────────────────────│
│ No 3: Cici                │
│ Nilai: [    ]  ⏳         │
│                           │
│ [💾 Simpan Semua]         │
└──────────────────────────┘
```

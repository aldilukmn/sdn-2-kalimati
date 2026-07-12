# FE Refactor Plan — SDN 2 Kalimati

## Phase 1: Fix Build & Critical Bug

### 1.1 Fix `dashboard-karakter/page.tsx:45` — missing `totalHabits` ✅
**File:** `app/(admin)/dashboard-karakter/page.tsx`
**Problem:** Destructuring `totalHabits` from `useDashboardKarakter()` but hook tidak mengembalikan property itu.
**Action:**
- Cek hook `hooks/useDashboardKarakter.ts`, lihat return type.
- Jika `totalHabits` bisa dihitung dari data yang ada di hook, tambahkan ke return.
- Jika tidak, hapus destructuring `totalHabits` dari page dan hapus penggunaannya di JSX.
**Status:** ✅ Selesai — kode sudah clean, `totalHabits` tidak ada di page maupun hook, build zero errors.

---

## Phase 2: Extract Shared Hooks & Constants ✅

### 2.1 Buat `useAuth()` hook — ganti semua JWT decode manual ✅
**Files yang berubah:**
- **NEW:** `hooks/useAuth.ts`
- `hooks/usePresensi.ts`
- `hooks/useNilaiHarian.ts`
- `hooks/useRekapNilai.ts`
- `hooks/useFinalScore.ts`
- `hooks/useStudentList.ts`
- `app/(admin)/data-gtk/page.tsx`
- `app/(admin)/data-pendaftar/page.tsx`
- `app/(admin)/dashboard-karakter/page.tsx`
- `app/(admin)/rekap-nilai-akhir/page.tsx`

### 2.2 Pindahkan `SEMESTERS` & `ACADEMIC_YEARS` ke `lib/constants.ts` ✅
**Files yang berubah:**
- `lib/constants.ts` — tambahkan export `SEMESTERS` dan `ACADEMIC_YEARS`
- `hooks/useNilaiHarian.ts`
- `hooks/useCharacterAssessment.ts`
- `hooks/useRekapNilai.ts`
- `hooks/useFinalScore.ts`
- `hooks/useDashboardKarakter.ts`
- `hooks/useRekapKarakter.ts`
- `hooks/useRekapNilaiAkhir.ts`
- `app/(admin)/kelola-mapel/page.tsx`

### 2.3 Pindahkan hardcoded values lain ke constants ✅
- `ITEMS_PER_PAGE` — `data-pendaftar/page.tsx` sudah pakai `ITEMS_PER_PAGE`
- `HISTORY_LIMIT` — `hooks/useHistoryModal.ts` import dari constants
- `MONTHLY_PER_PAGE` — `tabungan-murid/page.tsx` import dari constants
- `AVAILABLE_YEARS` — `dashboard/client.tsx` import dari constants

---

## Phase 3: Split Large Components ✅

### 3.1 Split `dashboard/client.tsx` (761 lines → ~3 files) ✅
**Extract ke:**
- `app/(admin)/dashboard/components/AdminDashboardView.tsx`
- `app/(admin)/dashboard/components/GuruDashboardView.tsx`
- `app/(admin)/dashboard/components/TabunganSection.tsx`
- `app/(admin)/dashboard/client.tsx` — jadi thin wrapper (46 lines)
- `MonthYearFilter` dipindah ke `components/shared/` di Phase 4.3

### 3.2 Split `data-gtk/page.tsx` (809 lines → 593 lines) ✅
**Extract ke:**
- `app/(admin)/data-gtk/components/AddEditModal.tsx` — FormData, emptyForm, ROLE_OPTIONS
- `app/(admin)/data-gtk/components/ConfirmDialog.tsx` — delete confirmation

### 3.3 Split `komponen-nilai/page.tsx` (524 lines) ✅
**Extract 3 tab view ke masing-masing komponen:**
- `app/(admin)/komponen-nilai/components/TabNilaiHarian.tsx`
- `app/(admin)/komponen-nilai/components/TabKarakter.tsx`
- `app/(admin)/komponen-nilai/components/TabNonHarian.tsx` — generic untuk ASTS/ASAS/Proyek dll

### 3.4 Split `kelola-mapel/page.tsx` (508 lines → 202 lines) ✅
**Extract:**
- `app/(admin)/kelola-mapel/components/SubjectsTab.tsx` — Daftar Mapel tab
- `app/(admin)/kelola-mapel/components/AssignTab.tsx` — Tetapkan ke Kelas tab
- `app/(admin)/kelola-mapel/components/SubjectModal.tsx` — create/edit mapel
- `app/(admin)/kelola-mapel/components/AssignModal.tsx` — assign mapel ke kelas
- `app/(admin)/kelola-mapel/components/ConfirmDeleteModal.tsx` — hapus confirmation

### 3.5 Split `tabungan-murid/page.tsx` (496 lines)
**Belum dikerjakan — skip karena tabungan sudah pernah di-split sebelumnya**

### 3.6 Split `useHistoryModal.ts` (244 lines) ✅
**Extract ke:**
- `hooks/useHistoryModal.ts` — hanya state modal + filter + pagination
- `hooks/useEditTransaction.ts` — edit form state + submission
- `hooks/useDeleteTransaction.ts` — confirm delete + submit

---

## Phase 4: Shared UI Components (Reduce Duplication) ✅

### 4.1 Buat `<FilterBar>` component ✅
**File:** `app/components/shared/FilterBar.tsx`
**Files terpengaruh (semua di-refactor):**
- `app/(admin)/nilai-harian/page.tsx`
- `app/(admin)/penilaian-karakter/page.tsx`
- `app/(admin)/rekap-nilai-harian/page.tsx`
- `app/(admin)/rekap-nilai-akhir/page.tsx`
- `app/(admin)/komponen-nilai/page.tsx`
- `app/(admin)/nilai-akhir/page.tsx`

**Desain:**
```tsx
interface FilterConfig {
  showAcademicYear?: boolean;
  showSemester?: boolean;
  showGrade?: boolean;
  showSubject?: boolean;
  showMonth?: boolean;
}
// Props: config + semua state values & setters
// Mendukung 3 variant: 4-col (TA/Semester/Kelas/Mapel), 4-col (TA/Semester/Bulan/Kelas), 3-col (TA/Semester/Kelas)
```

### 4.2 Buat `<ErrorState>`, `<EmptyState>`, `<LoadingSkeleton>` components ✅
**Lokasi:** `app/components/shared/`

**Desain:**
```tsx
<ErrorState error={error} onRetry={retry} variant="danger" />  {/* or variant="warning" */}
<EmptyState icon={Users} title="Belum ada data" description="..." action={{ label: "Buat", onClick: fn }} />
<LoadingSkeleton type="bars" rows={3} />   {/* or type="pulse-table" */}
<TableSkeleton headers={["No", "Nama", "Aksi"]} rows={5} />  {/* existing, migrated more pages */}
```

**Semua halaman admin di-refactor untuk pakai ini.**
Files refactored: nilai-harian, penilaian-karakter, rekap-nilai-harian, rekap-nilai-akhir, komponen-nilai, nilai-akhir, konfigurasi-nilai, konfigurasi-kaih, data-gtk, data-pendaftar, kelola-mapel/SubjectsTab, kelola-mapel/AssignTab.

### 4.3 Buat `<MonthYearFilter>` component ✅
**File:** `app/components/shared/MonthYearFilter.tsx`
**Ganti 5 kemunculan identik:**
- `AdminDashboardView` month/year selector (1x)
- `GuruDashboardView` (3x — inline `monthYearFilter` JSX)
- `TabunganSection` month/year (1x)

---

## Phase 5: Fix API Layer Issues ✅

### 5.1 Tambah type generic ke `UserService` methods ✅
**File:** `services/user.service.ts`
- Semua methods di-type dengan generic: `getTeachers<T>`, `getStaffByRoles<T>`, `getTeacherByGrade<T>`, `getAll<T>`, `create<T>`, `update<T>`, `delete<void>`, `setSavingsHolder<void>`, `setTreasurer<void>`
- `import()` type assertions diganti dengan top-level `import type { TeacherType }`
- `setTreasurer()` ditambahkan (dulu tidak ada)

### 5.2 Pindahkan inline interfaces ke `types/` ✅
- `types/assessment.ts` — `AssessmentScore`, `BulkAssessmentScoreRequest` (dari `services/assessment-score.service.ts`)
- `types/final-score.ts` — `ComponentScoreDto`, `FinalScoreEntry`, `CalculateResponse` (dari `services/final-score.service.ts`)
- Consumer imports di `useFinalScore.ts` dan `useRekapNilaiAkhir.ts` diupdate

### 5.3 Normalisasi `ApiResponse` — hapus dual field ❌
**Skipped** — terlalu invasive (touches ~50+ files). Perlu diputuskan nanti dengan tim.

### 5.4 Fix `api-server.ts` — tambah JSON parse error handling ✅
**File:** `lib/api-server.ts`
- Bungkus `response.json()` dengan try/catch, mirip `lib/api.ts`
- Tambah error message parsing dari `result?.status?.message`

### 5.5 Tambah AbortController ke hooks yang belum ✅
- `hooks/useHolidays.ts` — tambah AbortController di `useEffect`, cleanup on unmount
- `hooks/useDashboard.ts` (useTeacherDashboard) — tambah AbortController + fix `import()` type assertion ke top-level import

---

## Phase 6: Fix Anti-Patterns & Code Quality ✅

### 6.1 Fix empty catch blocks (4 tempat) ✅
- `hooks/useCharacterAssessment.ts:38` — tambah `console.error("JWT decode error:", e)`
- `hooks/useCharacterAssessment.ts:220` — tambah `console.error("Gagal menyimpan penilaian:", e)`
- `hooks/useCharacterAssessment.ts:224` — tambah `console.error("Gagal fetch ulang:", e)`
- `hooks/useDashboard.ts:104` — ganti `.catch(() => {})` → `.catch((e) => console.error(...))`

### 6.2 Fix `useEffect` missing dependencies ❌
**Skipped** — semua stale closures bersifat intentional (refer ke previous value untuk maintain selection). Menambah deps akan trigger infinite loop atau fetch redundan.

### 6.3 Hapus `console.log` debug ✅
- `hooks/useNilaiHarian.ts:228` — hapus `console.log("[SAVE]", {...})`

### 6.4 Ganti inline SVG dengan lucide-react icons ✅
**Tidak ada** — inline SVG sudah tidak ditemukan di `komponen-nilai/page.tsx` maupun `nilai-akhir/page.tsx` (terhapus saat Phase 4 refactor).

### 6.5 Hapus route guard duplikat di page components ✅
- `app/(admin)/data-gtk/page.tsx` — hapus route guard useEffect (redundan dengan proxy.ts); simplify kondisi fetch useEffect dan render guard
- `app/(admin)/data-pendaftar/page.tsx` — sama, hapus route guard + simplify guards

### 6.6 Simplify auth storage ❌
**Skipped** — middleware membutuhkan cookie untuk SSR route protection, API client butuh sessionStorage. Dual approach by design.

### 6.7 Ganti `import()` type assertions dengan proper imports ✅
- `services/user.service.ts` — ✅ selesai di 5.1
- `hooks/useDashboard.ts` — ✅ selesai di 5.5
- `app/(admin)/data-pendaftar/edit/[id]/page.tsx` — ganti `import().Registrant` → top-level import
- `app/(admin)/data-pendaftar/page.tsx` — ganti `import().PaginatedRegistrants` → top-level import
- `hooks/useStudentList.ts` — ganti `import().SavingsSummary` → top-level import
- `app/components/DashboardStatCards.tsx` — ganti `import("lucide-react").LucideIcon` → `type LucideIcon`

---

## Phase 7: Performance (Opsional, Quick Wins) ✅

### 7.1 Stop redundant API call di `useDashboard` ❌
**Skipped** — prev month data digunakan untuk `attendanceDelta` (Month-over-Month comparison) yang ditampilkan di UI.

### 7.2 Ganti polling `setInterval` dengan SWR `refreshInterval` ✅
**Cukup dengan existing cleanup** — `data-pendaftar/page.tsx` sudah punya `return () => clearInterval(interval);` di polling useEffect.

### 7.3 Batch staff API calls ✅
- `app/(admin)/data-gtk/page.tsx` — `getStaffByRoles("kepala")` + `getStaffByRoles("penjaga")` di-merge jadi satu call `getStaffByRoles("kepala,penjaga")`

---

## Urutan Implementasi

```
Phase 1 (Critical) → Phase 2 (Foundation) → Phase 3 + 4 (Parallel) → Phase 5 → Phase 6 → Phase 7
```

## Verifikasi

Setiap phase selesai:
1. **Phase 1:** `npm run build` harus sukses tanpa error
2. **Phase 2:** Semua halaman yang pakai `useAuth` masih berfungsi, filter masih muncul data yang benar
3. **Phase 3:** Navigasi ke setiap halaman yang di-split, pastikan UI tidak berubah
4. **Phase 4:** Semua halaman dengan FilterBar/ErrorState/EmptyState render dengan benar
5. **Phase 5:** API calls masih berfungsi, type error tidak muncul
6. **Phase 6:** Tidak ada warning di console, build tetap bersih
7. **Phase 7:** Response time tidak regresi, tidak ada memory leak

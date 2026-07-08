# Sprint Plan — Frontend Nilai Harian & Assessment

## Legend

- [ ] Belum dikerjakan
- [x] Selesai

---

## Phase 1 — Nilai Harian (Frontend)

---

### Sprint 1: Master Mapel

**Tujuan:** CRUD Mata Pelajaran + Tetapkan ke Kelas

| Item | Detail |
|------|--------|
| Halaman | `/master-mapel` (2 tab: Daftar Mapel + Tetapkan ke Kelas) |
| Komponen | `Modal` (existing), `TableSkeleton` (existing), shadcn `Select` (existing) |
| Hook | `useSubjects.ts` |
| Service | `subject.service.ts`, `grade-subject.service.ts` |
| API | `GET/POST/PATCH/DELETE /api/subjects`, `GET/POST/PATCH/DELETE /api/grade-subjects` |
| Kompleksitas | Low |
| Dependency | None |
| Testable | ✅ Ya |

**Definition of Done:**
- [x] Admin dapat membuat, mengedit, menghapus mapel
- [x] Admin dapat menetapkan mapel ke kelas (grade + semester + TA)
- [x] Mapel yang masih dipakai tidak bisa dihapus (error dari backend)
- [x] Search/filter mapel bekerja
- [x] Empty state: "Belum ada Mata Pelajaran" / "Belum ada yang ditetapkan"
- [x] Loading skeleton, error toast
- [x] Proxy guard: admin/kepala only
- [x] Sidebar nav item "Mapel & Struktur"

---

### Sprint 2: Struktur Akademik (Bab & Materi)

**Tujuan:** CRUD Bab + CRUD Materi + Reorder (native DnD)

| Item | Detail |
|------|--------|
| Halaman | `/master-struktur` |
| Komponen | `Modal` (existing), drag-handle per row |
| Hook | `useChapters.ts` |
| Service | `chapter.service.ts`, `material.service.ts` |
| API | `GET/POST/PATCH/DELETE /api/chapters`, `PUT /api/chapters/reorder`, `GET/POST/PATCH/DELETE /api/materials`, `PUT /api/materials/reorder` |
| Kompleksitas | Medium |
| Dependency | Sprint 1 (butuh grade-subject) |
| Testable | ✅ Ya |

**Definition of Done:**
- [x] Dropdown pilih mapel → load bab
- [x] CRUD bab (name + inputMode)
- [x] CRUD materi
- [x] Native DnD reorder (fallback: up/down button)
- [x] Bab yang punya nilai tidak bisa diubah inputMode / dihapus
- [x] Materi yang punya nilai tidak bisa dihapus
- [x] Empty state: "Belum ada Bab" / "Bab ini belum memiliki Materi"
- [x] Loading skeleton, error toast
- [x] Proxy guard: admin/kepala only

---

### Sprint 3: Input Nilai Harian ⭐

**Tujuan:** Halaman input nilai per bab/materi untuk guru

| Item | Detail |
|------|--------|
| Halaman | `/nilai-harian` |
| Komponen | `ChapterProgressCard`, `MaterialTab`, `ScoreTable` |
| Hook | `useNilaiHarian.ts` |
| Service | `score.service.ts` |
| API | `GET /api/scores/`, `POST /api/scores/bulk`, `GET /api/student-attendance/students?grade=` |
| Kompleksitas | **High** |
| Dependency | Sprint 2 (butuh chapters + materials) |
| Testable | ✅ Ya |

**Definition of Done:**
- [x] Filter TA, semester, grade, mapel → load chapter cards
- [x] Card: nama, badge `[Per Bab]`/`[Per Materi]`, progress bar
- [x] Klik card → select chapter → load score table
- [x] Jika per_material: tab materi di atas tabel
- [x] Tabel: No, Nama, Nilai (numeric), Maks, Status (✅/⏳/❌)
- [ ] Tab/Enter navigation
- [x] `[💾 Simpan Semua]` → bulk save → toast
- [x] Auto-select chapter pertama yang belum selesai
- [x] Empty state: "Belum ada Bab yang dapat dinilai"
- [x] Skeleton, toast, error state
- [ ] Responsive

---

### Sprint 4: Rekap Nilai Harian

**Tujuan:** Tampilkan rata-rata nilai per chapter dan per mapel

| Item | Detail |
|------|--------|
| Halaman | `/rekap-nilai` |
| Komponen | `RekapTable` dengan expand per chapter |
| Hook | `useRekapNilai.ts` |
| Service | (reuse `score.service.ts`) |
| API | `GET /api/scores/` |
| Kompleksitas | Medium |
| Dependency | Sprint 3 (butuh data score) |
| Testable | ✅ Ya |

**Definition of Done:**
- [ ] Filter TA, semester, grade, mapel
- [ ] Tabel: baris = siswa, kolom = chapter, kolom akhir = rata-rata
- [ ] Footer: rata-rata kelas per chapter
- [ ] Expand baris → detail per materi
- [ ] Empty state, skeleton, toast, responsive

---

### Sprint 5: UX Enhancement — Nilai Harian

**Tujuan:** Polish semua halaman Nilai Harian (Sprint 1-4)

| Item | Detail |
|------|--------|
| Tugas | Empty state (11 varian), skeleton, toast, badge, loading state, error state (retry), responsive testing |
| Kompleksitas | Medium |
| Dependency | Sprint 1-4 |
| Testable | ❌ Tidak |

**Definition of Done:**
- [ ] Semua empty state sesuai UI_FLOW.md
- [ ] Skeleton saat loading
- [ ] Toast setelah setiap aksi
- [ ] Badge metode input konsisten
- [ ] Tombol disable + spinner saat proses
- [ ] Error state + retry button
- [ ] Responsive di 320px, 768px, 1280px

---

## Phase 2 — Assessment (Frontend)

---

### Sprint 6: Konfigurasi Penilaian

**Tujuan:** CRUD komponen penilaian + atur bobot + validasi 100%

| Item | Detail |
|------|--------|
| Halaman | `/master-konfigurasi-nilai` |
| Komponen | `ConfigForm` — dynamic rows, live weight, formula preview |
| Hook | `useAssessmentConfig.ts` |
| Service | `assessment-config.service.ts` |
| API | `GET/POST/PATCH/DELETE /api/assessment-configs`, `GET /api/assessment-configs/active` |
| Kompleksitas | Medium |
| Dependency | None |
| Testable | ✅ Ya |

**Definition of Done:**
- [ ] Filter grade → table configs
- [ ] Modal create: dynamic component rows (key, name, weight)
- [ ] `[+ Tambah Komponen]`, `🗑` hapus row
- [ ] Live total bobot: hijau ✅ = 100%, merah ❌ ≠ 100%
- [ ] Live formula preview
- [ ] Tombol Simpan disabled jika total ≠ 100%
- [ ] Key `"harian"` reserved + harus ada
- [ ] Empty state, skeleton, toast

---

### Sprint 7: Input Nilai Komponen

**Tujuan:** Input nilai ASTS/ASAS/Proyek + readonly Nilai Harian

| Item | Detail |
|------|--------|
| Halaman | `/nilai-komponen` |
| Komponen | `AssessmentScoreTable` — tab komponen, range 0-100 |
| Hook | `useAssessmentScore.ts` |
| Service | `assessment-score.service.ts`, (reuse `score.service.ts`) |
| API | `GET/POST/PATCH/DELETE /api/assessment-scores` |
| Kompleksitas | **High** |
| Dependency | Sprint 3 (harian readonly), Sprint 6 (active config) |
| Testable | ✅ Ya |

**Definition of Done:**
- [ ] Filter TA, semester, grade, mapel
- [ ] Tab komponen dari config aktif
- [ ] Tab "Nilai Harian" → readonly
- [ ] Tab non-harian → score input (range 0-100)
- [ ] `[💾 Simpan Semua]` → toast
- [ ] Empty state: "Belum ada Config aktif" / "Input Nilai Harian dulu"

---

### Sprint 8: Nilai Akhir + Hitung Ulang ⭐

**Tujuan:** Tampilkan final score + recalculate + stale detection

| Item | Detail |
|------|--------|
| Halaman | `/nilai-akhir` |
| Komponen | `RingkasanPanel`, `FinalScoreTable` (expand), `StaleBanner` |
| Hook | `useFinalScore.ts` |
| Service | `final-score.service.ts` |
| API | `GET /api/final-scores`, `POST /api/final-scores/calculate` |
| Kompleksitas | **High** |
| Dependency | Sprint 3+6+7 |
| Testable | ✅ Ya |

**Definition of Done:**
- [ ] Filter TA, semester, grade, mapel
- [ ] RingkasanPanel: ✅ lengkap, ⚠️ belum lengkap
- [ ] Info "Terakhir dihitung: ..."
- [ ] StaleBanner jika `isStale`
- [ ] FinalScoreTable + expand detail per komponen
- [ ] `[🔄 Hitung Ulang]` → loading → toast → auto-refresh
- [ ] Empty state (belum dihitung): `[Hitung Sekarang]`
- [ ] Empty state (filter kosong)

---

### Sprint 9: Rekap Nilai Akhir + UX + Final Review

**Tujuan:** Rekap + polish + final E2E review

| Item | Detail |
|------|--------|
| Tugas | Tabel rekap per siswa × mapel; UX polish semua halaman Phase 2; responsive testing |
| Kompleksitas | Medium |
| Dependency | Sprint 8 (butuh final score data) |
| Testable | ❌ Tidak |

**Definition of Done:**
- [ ] Tabel rekap: baris = siswa, kolom = mapel, rata-rata
- [ ] Filter grade
- [ ] Semua halaman Phase 2: empty state, skeleton, toast, error, responsive
- [ ] **E2E flow:** create mapel → assign → bab → materi → input nilai → konfigurasi → input komponen → hitung akhir → rekap

---

## Dependency Graph

```
Sprint 1 ──→ Sprint 2 ──→ Sprint 3 ──→ Sprint 4
                                    ↘         ↘
                                      Sprint 5 (UX)
                                    ↗
Sprint 6 ──→ Sprint 7 ──→ Sprint 8 ──→ Sprint 9 (UX + Final)
```

Sprint 1 dan 6 bisa paralel.

## Estimasi

| Sprint | Hari |
|--------|------|
| 1 | 1 |
| 2 | 1.5 |
| 3 ⭐ | 3 |
| 4 | 1 |
| 5 | 1.5 |
| 6 | 1.5 |
| 7 | 2.5 |
| 8 ⭐ | 3 |
| 9 | 2 |
| **Total** | **~17** |

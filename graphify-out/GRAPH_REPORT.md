# Graph Report - sdn-2-kalimati  (2026-07-27)

## Corpus Check
- 277 files · ~125,438 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1152 nodes · 2763 edges · 89 communities (57 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3df198a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- select.tsx
- student-attendance.service.ts
- login/page.tsx
- useAssessmentScore.ts
- student-savings.service.ts
- character-assessment.service.ts
- IncompleteDataWidget.tsx
- Refactoring Roadmap (20 Items)
- komponen-nilai/page.tsx
- Pagination.tsx
- compilerOptions
- NoteCard.tsx
- useNilaiHarian
- components.json
- pmb/page.tsx
- StudentDataStep.tsx
- DashboardSidebar.tsx
- cn
- data-pendaftar/page.tsx
- grade-subject.service.ts
- dependencies
- nilai-harian.ts
- Sprint 3: Input Nilai Harian
- devDependencies
- app/layout.tsx
- table.tsx
- useRekapNilaiAkhir.ts
- kelola-mapel/page.tsx
- lib/api.ts
- proxy.ts
- app/page.tsx
- kelas-5/page.tsx
- clsx
- package.json
- AttendanceBarChart.tsx
- StudentAttendanceTable.tsx
- useDashboard.ts
- siswa.ts
- MonthYearPicker.tsx
- PresensiStatusBadge.tsx
- useAuth
- AttendanceDonutChart.tsx
- GraduationCountdownModal.tsx
- .getAll
- piket-kelas/page.tsx
- rekap-presensi/layout.tsx
- TextAreaField.tsx
- type.ts
- jadwal-pelajaran/page.tsx
- IncompleteDataWidget.tsx
- lib/api.ts
- kelas.ts
- date-fns
- Conventional Commits Format
- html-to-image
- next
- next.config.ts
- react
- react-hot-toast
- recharts
- shadcn
- tailwind-merge
- lucide-react
- @tiptap/starter-kit
- tw-animate-css
- xlsx
- postcss.config.mjs
- countdown.ts
- navigate.ts
- Dashboard Improvements (MoM, Trends, Insights)
- SDN 2 Kalimati Tech Stack
- School Seal/Logo Image
- SDN 2 Kalimati Logo
- data-gtk/page.tsx
- useAuth
- export-presensi-csv.ts
- UserService
- MasterStudentType
- holiday.service.ts
- README.md
- problems.md

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 52 edges
2. `cn()` - 32 edges
3. `api()` - 27 edges
4. `GRADES` - 26 edges
5. `SelectGroup()` - 22 edges
6. `SelectValue()` - 22 edges
7. `SelectTrigger()` - 22 edges
8. `SelectContent()` - 22 edges
9. `SelectItem()` - 22 edges
10. `StudentAttendanceService` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Conventional Commits Format` --semantically_similar_to--> `FE + BE Git Workflow`  [INFERRED] [semantically similar]
  docs/git/commit-rules.md → .gemini/rules/git-workflow.md
- `MasterMapelPage()` --calls--> `useSubjects()`  [EXTRACTED]
  app/(admin)/kelola-mapel/page.tsx → hooks/useSubjects.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `CardContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Known Issue Cluster** — agents_n_plus_one_api_calls, agents_missing_loading_tsx, agents_known_issues [EXTRACTED 1.00]
- **Sprint Dependency Chain** — docs_sprint_plan_sprint_1, docs_sprint_plan_sprint_2, docs_sprint_plan_sprint_3, docs_sprint_plan_sprint_4, docs_sprint_plan_sprint_5, docs_sprint_plan_sprint_6, docs_sprint_plan_sprint_7, docs_sprint_plan_sprint_8, docs_sprint_plan_sprint_9, docs_sprint_plan_dependency_graph [EXTRACTED 1.00]
- **Refactor Phase Sequence** — docs_fe_refactor_plan_phase_1, docs_fe_refactor_plan_phase_2, docs_fe_refactor_plan_phase_3, docs_fe_refactor_plan_phase_4, docs_fe_refactor_plan_phase_5, docs_fe_refactor_plan_phase_6, docs_fe_refactor_plan_phase_7 [EXTRACTED 1.00]
- **Refactoring Roadmap Cluster** — agents_refactoring_roadmap, agents_statcard, agents_pagehero, agents_modal, agents_grades_constant, agents_items_per_page, agents_type_cleanup, agents_tabungan_murid [EXTRACTED 1.00]

## Communities (89 total, 32 thin omitted)

### Community 0 - "select.tsx"
Cohesion: 0.05
Nodes (68): Modal, NilaiStatCards(), NilaiStatCardsProps, SavingsTrendChart, AttendanceTrendChart, AttendanceTrendWidget(), AttendanceTrendWidgetProps, PresensiStatCards() (+60 more)

### Community 1 - "student-attendance.service.ts"
Cohesion: 0.16
Nodes (12): Props, STATUS_LIST, AttendanceSummary, GradeAttendanceRow, StudentAbsenceRow, ViewMode, Entry, STATUS_BTN (+4 more)

### Community 2 - "login/page.tsx"
Cohesion: 0.18
Nodes (12): ComponentBreakdown(), ComponentBreakdownProps, StudentRanking(), StudentRankingProps, DashboardNilaiPage(), getInitialAcademicYear(), getInitialSemester(), useDashboardNilai() (+4 more)

### Community 3 - "useAssessmentScore.ts"
Cohesion: 0.07
Nodes (28): NilaiLitnumPage(), PenilaianPage(), useAssessmentConfig(), useAssessmentStudents(), KarakterStudent, useKarakterData(), useKeaktifanData(), useLitnumData() (+20 more)

### Community 4 - "student-savings.service.ts"
Cohesion: 0.05
Nodes (45): TabunganSection(), TabunganMuridPage(), MONTHS_SHORT, Props, SavingsTrendChart(), LoadingDots(), ModalProps, ConfirmDeleteModalProps (+37 more)

### Community 5 - "character-assessment.service.ts"
Cohesion: 0.07
Nodes (32): DashboardKarakterPage(), KonfigurasiKaihPage(), Modal, KarakterDetailPage(), PenilaianKarakterPage(), HabitRadioGroup(), HabitRadioGroupProps, OPTIONS (+24 more)

### Community 6 - "IncompleteDataWidget.tsx"
Cohesion: 0.29
Nodes (9): Props, AttendanceDonutChart, GuruDashboardView(), TeacherSummary, useTeacherDashboard(), useTeacherChart(), AttendanceMapValue, AttendanceRow (+1 more)

### Community 7 - "Refactoring Roadmap (20 Items)"
Cohesion: 0.07
Nodes (34): lib/api.ts API Client, ApiResponse T Type, DashboardSidebar Component, DateDayPicker Component, Dual Token Auth (sessionStorage + cookie), GRADES Constant, Holiday System, ITEMS_PER_PAGE Constant (+26 more)

### Community 8 - "komponen-nilai/page.tsx"
Cohesion: 0.19
Nodes (10): Props, ChapterService, ScoreService, StudentAttendanceService, Chapter, ChapterCreateRequest, ChapterUpdateRequest, ClassAverageItem (+2 more)

### Community 9 - "Pagination.tsx"
Cohesion: 0.09
Nodes (16): RecentActivities(), RecentActivitiesProps, RecentActivity, gameLinks, dataTKA, getGrade(), HasilTKA(), dataKelulusan (+8 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 11 - "NoteCard.tsx"
Cohesion: 0.17
Nodes (10): CatatanPage(), NoteCard(), NoteCardProps, RichTextEditorProps, useNotes(), formatDateWithDayID(), NoteService, Note (+2 more)

### Community 12 - "useNilaiHarian"
Cohesion: 0.18
Nodes (9): BerandaPenjaga(), LoginPage(), LogoutButton(), ROLE_STYLES, AuthCard(), AuthCardProps, AuthService, JwtPayload (+1 more)

### Community 13 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 14 - "pmb/page.tsx"
Cohesion: 0.24
Nodes (7): MasterStrukturPage(), useChapters(), MaterialService, Material, MaterialCreateRequest, MaterialUpdateRequest, ReorderItem

### Community 15 - "StudentDataStep.tsx"
Cohesion: 0.05
Nodes (50): EditRegistration(), emptyForm, DataPendaftar(), formatDateTime(), initialFormData, Pmb(), DatePickerFieldProps, HolidayInfoCard() (+42 more)

### Community 16 - "DashboardSidebar.tsx"
Cohesion: 0.18
Nodes (11): DashboardSidebar(), SidebarProps, useAssessmentConfig(), useSidebarData(), guruAllowedHrefs, MenuGroup, MenuItem, menuItems (+3 more)

### Community 17 - "cn"
Cohesion: 0.06
Nodes (43): DailyPresensiView(), DistribusiStatus(), DistribusiStatusProps, InsightTable(), ABSEN_COLOR(), AttendanceBarChart, MonthlyPresensiView(), MonthlyPresensiViewProps (+35 more)

### Community 18 - "data-pendaftar/page.tsx"
Cohesion: 0.21
Nodes (8): AdminDashboardView(), CARDS, DashboardStatCards(), Props, StatCardKey, Props, DashboardSummary, useDashboard()

### Community 19 - "grade-subject.service.ts"
Cohesion: 0.26
Nodes (6): SubjectsTabProps, useSubjects(), SubjectService, Subject, SubjectCreateRequest, SubjectUpdateRequest

### Community 20 - "dependencies"
Cohesion: 0.12
Nodes (17): @base-ui/react, canvas-confetti, gsap, dependencies, @base-ui/react, canvas-confetti, gsap, react-day-picker (+9 more)

### Community 21 - "nilai-harian.ts"
Cohesion: 0.18
Nodes (11): TabNonHarianProps, Props, ACADEMIC_YEARS, SEMESTERS, AssessmentConfigCreateRequest, AssessmentComponent, AssessmentConfig, BulkScoreItem (+3 more)

### Community 22 - "Sprint 3: Input Nilai Harian"
Cohesion: 0.23
Nodes (17): Assessment Module (Phase 2), Sprint Dependency Graph, Nilai Harian Module (Phase 1), Sprint 1: Master Mapel, Sprint 2: Struktur Akademik, Sprint 3: Input Nilai Harian, Sprint 4: Rekap Nilai Harian, Sprint 5: UX Enhancement (+9 more)

### Community 23 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react, @types/react-dom, typescript (+7 more)

### Community 24 - "app/layout.tsx"
Cohesion: 0.27
Nodes (7): DashboardClient(), DashboardPage(), AdminLayout(), metadata, AuthResult, ProfileState, decodeJWT()

### Community 25 - "table.tsx"
Cohesion: 0.27
Nodes (6): AssignTabProps, GradeSubjectService, BulkGradeSubjectCreateRequest, GradeSubject, GradeSubjectCreateRequest, GradeSubjectUpdateRequest

### Community 26 - "useRekapNilaiAkhir.ts"
Cohesion: 0.27
Nodes (8): NilaiAkhirPage(), useFinalScore(), useRekapNilaiAkhir(), FinalScoreService, CalculateResponse, ComponentScoreDto, FinalScoreEntry, GradeSubjectQueryParams

### Community 27 - "kelola-mapel/page.tsx"
Cohesion: 0.20
Nodes (7): AssignModal(), ConfirmDeleteModalProps, Modal, Modal, SubjectModal(), SubjectModalProps, MasterMapelPage()

### Community 29 - "proxy.ts"
Cohesion: 0.33
Nodes (9): config, decodeBase64(), decodeJWTPayload(), GRADUATION_ANNOUNCEMENT_DATE, isTokenExpired(), proxy(), redirectToForbidden(), redirectToLogin() (+1 more)

### Community 30 - "app/page.tsx"
Cohesion: 0.28
Nodes (5): GRADUATION_ANNOUNCEMENT_DATE, GraduationCountdownModal, navigationLinks, TextType(), TextTypeProps

### Community 33 - "package.json"
Cohesion: 0.25
Nodes (7): name, private, scripts, build, dev, start, version

### Community 34 - "AttendanceBarChart.tsx"
Cohesion: 0.38
Nodes (6): AttendanceBarChart(), GRADE_COLORS, Props, RECHARTS_PROPS, sanitizeDOMProps(), SKELETON_HEIGHTS

### Community 35 - "StudentAttendanceTable.tsx"
Cohesion: 0.38
Nodes (6): getRateColor(), Props, RATE_COLORS, STATUS_COLUMNS, StudentAttendanceTable(), StudentRow

### Community 36 - "useDashboard.ts"
Cohesion: 0.33
Nodes (7): AttendanceTrendChart(), MONTHS_SHORT, Props, DashboardService, AttendanceTrendItem, DashboardSummary, TeacherDashboardSummary

### Community 37 - "siswa.ts"
Cohesion: 0.33
Nodes (3): daftarKelas, dataSiswa, Siswa

### Community 38 - "MonthYearPicker.tsx"
Cohesion: 0.40
Nodes (3): CURRENT_YEAR, MONTHS, MonthYearPickerProps

### Community 39 - "PresensiStatusBadge.tsx"
Cohesion: 0.40
Nodes (3): ITEMS, Props, StatusCardItem

### Community 40 - "useAuth"
Cohesion: 0.20
Nodes (6): ProfileView(), Props, ROLE_COLORS, ROLE_LABELS, RekapNilaiAkhirPage(), useAuth()

### Community 43 - ".getAll"
Cohesion: 0.27
Nodes (6): NilaiHarianPage(), RekapNilaiPage(), useHarianData(), useNilaiHarian(), useRekapNilai(), BulkScoreRequest

### Community 57 - "IncompleteDataWidget.tsx"
Cohesion: 0.32
Nodes (5): ChecklistItem, formatCategoryLabel(), formatDayDate(), IncompleteDataWidget(), IncompleteDataWidgetProps

### Community 58 - "lib/api.ts"
Cohesion: 0.36
Nodes (4): api(), getCookie(), ApiResponse, ApiStatus

### Community 60 - "date-fns"
Cohesion: 0.40
Nodes (4): DashboardShell(), Props, DashboardNavbar(), NavbarProps

### Community 83 - "data-gtk/page.tsx"
Cohesion: 0.18
Nodes (10): emptyForm, FormData, Modal, ROLE_OPTIONS, ConfirmDialog(), Modal, ExportWordButton(), exportPresensiMatriksToWord() (+2 more)

### Community 84 - "useAuth"
Cohesion: 0.33
Nodes (5): DashboardPresensiPage(), RekapPresensi(), useDashboardPresensi(), useHolidays(), usePresensi()

### Community 85 - "export-presensi-csv.ts"
Cohesion: 0.26
Nodes (13): RekapKarapkterPage(), downloadCSV(), wrap(), exportRegistrantsToCSV(), formatDate(), HEADERS, AttendanceRecapRow, AttendanceRow (+5 more)

### Community 89 - "UserService"
Cohesion: 0.22
Nodes (3): DataGTK(), useProfile(), UserService

### Community 90 - "MasterStudentType"
Cohesion: 0.42
Nodes (3): DataMuridPage(), MasterStudentService, MasterStudentType

### Community 92 - "holiday.service.ts"
Cohesion: 0.25
Nodes (5): PresensiMuridPage(), HolidayItem, HolidayService, Holiday, HolidayCheckResult

### Community 95 - "README.md"
Cohesion: 0.33
Nodes (5): Dashboard Admin (`/dashboard`), Deploy on Vercel, Fitur Utama, Getting Started, Learn More

## Knowledge Gaps
- **265 isolated node(s):** `Modal`, `NilaiStatCardsProps`, `RecentActivity`, `RecentActivitiesProps`, `AttendanceTrendChart` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `useAuth` to `select.tsx`, `student-attendance.service.ts`, `login/page.tsx`, `useAssessmentScore.ts`, `student-savings.service.ts`, `character-assessment.service.ts`, `IncompleteDataWidget.tsx`, `komponen-nilai/page.tsx`, `NoteCard.tsx`, `useNilaiHarian`, `pmb/page.tsx`, `StudentDataStep.tsx`, `DashboardSidebar.tsx`, `cn`, `app/layout.tsx`, `useRekapNilaiAkhir.ts`, `.getAll`, `date-fns`, `data-gtk/page.tsx`, `useAuth`, `UserService`, `MasterStudentType`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `clsx`, `package.json`, `react`, `react-hot-toast`, `recharts`, `shadcn`, `lucide-react`, `tailwind-merge`, `@tiptap/starter-kit`, `tw-animate-css`, `xlsx`, `lib/api.ts`, `next`, `html-to-image`, `kelas-5/page.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `xlsx` connect `xlsx` to `MasterStudentType`, `student-savings.service.ts`, `dependencies`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `Modal`, `NilaiStatCardsProps`, `RecentActivity` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `select.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.050747442958300554 - nodes in this community are weakly interconnected._
- **Should `useAssessmentScore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._
- **Should `student-savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050957481337228175 - nodes in this community are weakly interconnected._
# Graph Report - sdn-2-kalimati  (2026-08-04)

## Corpus Check
- 281 files · ~127,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1166 nodes · 2831 edges · 93 communities (60 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36ddd36d`
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
- class-variance-authority
- cn
- detail/page.tsx
- grade-subject.service.ts
- dependencies
- nilai-harian.ts
- Sprint 3: Input Nilai Harian
- devDependencies
- app/layout.tsx
- table.tsx
- useRekapNilaiAkhir.ts
- kelola-mapel/page.tsx
- AdminDashboardView.tsx
- proxy.ts
- app/page.tsx
- kelas-5/page.tsx
- clsx
- package.json
- AttendanceBarChart.tsx
- StudentAttendanceTable.tsx
- Pagination.tsx
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
- holiday.service.ts
- Conventional Commits Format
- html-to-image
- next
- next.config.ts
- react
- react-hot-toast
- recharts
- shadcn
- tailwind-merge
- useDashboardPresensi.ts
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
- PresensiTable.tsx
- lucide-react
- export-presensi-csv.ts
- dashboard-akademik/page.tsx
- cn
- MonthlyPresensiView.tsx
- holiday.service.ts
- README.md
- detail/page.tsx
- kelas-5/page.tsx
- problems.md
- kelas-5/data/index.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 58 edges
2. `cn()` - 32 edges
3. `api()` - 27 edges
4. `GRADES` - 26 edges
5. `StudentAttendanceService` - 23 edges
6. `MONTHS_ID` - 22 edges
7. `SelectGroup()` - 21 edges
8. `SelectValue()` - 21 edges
9. `SelectTrigger()` - 21 edges
10. `SelectContent()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Conventional Commits Format` --semantically_similar_to--> `FE + BE Git Workflow`  [INFERRED] [semantically similar]
  docs/git/commit-rules.md → .gemini/rules/git-workflow.md
- `AssignTabProps` --references--> `GradeSubject`  [EXTRACTED]
  app/(admin)/kelola-mapel/components/AssignTab.tsx → types/nilai-harian.ts
- `SubjectsTabProps` --references--> `Subject`  [EXTRACTED]
  app/(admin)/kelola-mapel/components/SubjectsTab.tsx → types/nilai-harian.ts
- `MasterMapelPage()` --calls--> `useSubjects()`  [EXTRACTED]
  app/(admin)/kelola-mapel/page.tsx → hooks/useSubjects.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Known Issue Cluster** — agents_n_plus_one_api_calls, agents_missing_loading_tsx, agents_known_issues [EXTRACTED 1.00]
- **Sprint Dependency Chain** — docs_sprint_plan_sprint_1, docs_sprint_plan_sprint_2, docs_sprint_plan_sprint_3, docs_sprint_plan_sprint_4, docs_sprint_plan_sprint_5, docs_sprint_plan_sprint_6, docs_sprint_plan_sprint_7, docs_sprint_plan_sprint_8, docs_sprint_plan_sprint_9, docs_sprint_plan_dependency_graph [EXTRACTED 1.00]
- **Refactor Phase Sequence** — docs_fe_refactor_plan_phase_1, docs_fe_refactor_plan_phase_2, docs_fe_refactor_plan_phase_3, docs_fe_refactor_plan_phase_4, docs_fe_refactor_plan_phase_5, docs_fe_refactor_plan_phase_6, docs_fe_refactor_plan_phase_7 [EXTRACTED 1.00]
- **Refactoring Roadmap Cluster** — agents_refactoring_roadmap, agents_statcard, agents_pagehero, agents_modal, agents_grades_constant, agents_items_per_page, agents_type_cleanup, agents_tabungan_murid [EXTRACTED 1.00]

## Communities (93 total, 33 thin omitted)

### Community 0 - "select.tsx"
Cohesion: 0.19
Nodes (22): Modal, SavingsTrendChart, Modal, AssignModalProps, Modal, Modal, DateDayPicker(), DateDayPickerProps (+14 more)

### Community 1 - "student-attendance.service.ts"
Cohesion: 0.17
Nodes (11): EditRegistration(), emptyForm, initialFormData, Pmb(), RegistrationCard(), RegistrationCounter(), LoadingModal(), LoadingModalProps (+3 more)

### Community 2 - "login/page.tsx"
Cohesion: 0.18
Nodes (12): ComponentBreakdown(), ComponentBreakdownProps, StudentRanking(), StudentRankingProps, DashboardNilaiPage(), getInitialAcademicYear(), getInitialSemester(), useDashboardNilai() (+4 more)

### Community 3 - "useAssessmentScore.ts"
Cohesion: 0.05
Nodes (34): DataMuridPage(), NilaiLitnumPage(), PenilaianPage(), useAssessmentConfig(), useAssessmentStudents(), KarakterStudent, useKarakterData(), useKeaktifanData() (+26 more)

### Community 4 - "student-savings.service.ts"
Cohesion: 0.05
Nodes (45): TabunganSection(), TabunganMuridPage(), MONTHS_SHORT, Props, SavingsTrendChart(), LoadingDots(), ModalProps, ConfirmDeleteModalProps (+37 more)

### Community 5 - "character-assessment.service.ts"
Cohesion: 0.13
Nodes (14): KonfigurasiKaihPage(), Modal, HabitRadioGroup(), HabitRadioGroupProps, OPTIONS, Props, StudentRow, StudentScore (+6 more)

### Community 6 - "IncompleteDataWidget.tsx"
Cohesion: 0.27
Nodes (8): AttendanceTrendChart(), MONTHS_SHORT, Props, useTeacherDashboard(), DashboardService, AttendanceTrendItem, DashboardSummary, TeacherDashboardSummary

### Community 7 - "Refactoring Roadmap (20 Items)"
Cohesion: 0.07
Nodes (34): lib/api.ts API Client, ApiResponse T Type, DashboardSidebar Component, DateDayPicker Component, Dual Token Auth (sessionStorage + cookie), GRADES Constant, Holiday System, ITEMS_PER_PAGE Constant (+26 more)

### Community 8 - "komponen-nilai/page.tsx"
Cohesion: 0.29
Nodes (8): exportPresensiMatriksToWord(), StudentAttendanceService, AttendanceReportItem, MasterStudentType, StudentAttendanceRequestType, StudentAttendanceType, TeacherType, User

### Community 9 - "Pagination.tsx"
Cohesion: 0.17
Nodes (7): getScoreColor(), KarakterHistoryPage(), SCORE_COLORS, gameLinks, tariLinks, TypeTariLinks, BackButton()

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 11 - "NoteCard.tsx"
Cohesion: 0.18
Nodes (10): CatatanPage(), NoteCard(), NoteCardProps, RichTextEditorProps, useNotes(), formatDateWithDayID(), NoteService, Note (+2 more)

### Community 12 - "useNilaiHarian"
Cohesion: 0.18
Nodes (11): DashboardSidebar(), SidebarProps, useAssessmentConfig(), useSidebarData(), guruAllowedHrefs, MenuGroup, MenuItem, menuItems (+3 more)

### Community 13 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 14 - "pmb/page.tsx"
Cohesion: 0.20
Nodes (12): DataPendaftar(), formatDateTime(), HolidayInfoCard(), HolidayInfoCardProps, formatDateID(), printRegistrantForm(), Address, Guardian (+4 more)

### Community 15 - "StudentDataStep.tsx"
Cohesion: 0.13
Nodes (15): DatePickerFieldProps, InputField, InputFieldProps, SelectField, SelectFieldProps, GuardianDataStepProps, ParentDataStepProps, StudentDataStepProps (+7 more)

### Community 17 - "cn"
Cohesion: 0.33
Nodes (10): DailyPresensiView(), AssignTabProps, SubjectsTabProps, Table(), TableBody(), TableCell(), TableFooter(), TableHead() (+2 more)

### Community 18 - "detail/page.tsx"
Cohesion: 0.22
Nodes (10): HabitDisplay, SCORE_COLORS, VALUE_COLORS, RecentAssessment, AssessmentCreateRequest, AssessmentListItem, AssessmentUpdateRequest, CharacterAssessment (+2 more)

### Community 19 - "grade-subject.service.ts"
Cohesion: 0.05
Nodes (54): MasterStrukturPage(), TabNonHarianProps, NilaiAkhirPage(), NilaiHarianPage(), RekapNilaiPage(), Props, Props, useHarianData() (+46 more)

### Community 20 - "dependencies"
Cohesion: 0.12
Nodes (17): @base-ui/react, canvas-confetti, gsap, dependencies, @base-ui/react, canvas-confetti, gsap, react-day-picker (+9 more)

### Community 21 - "nilai-harian.ts"
Cohesion: 0.19
Nodes (11): geist, metadata, poppins, RootLayout(), ThemeProvider(), AuthContext, AuthContextType, AuthProvider() (+3 more)

### Community 22 - "Sprint 3: Input Nilai Harian"
Cohesion: 0.23
Nodes (17): Assessment Module (Phase 2), Sprint Dependency Graph, Nilai Harian Module (Phase 1), Sprint 1: Master Mapel, Sprint 2: Struktur Akademik, Sprint 3: Input Nilai Harian, Sprint 4: Rekap Nilai Harian, Sprint 5: UX Enhancement (+9 more)

### Community 23 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react, @types/react-dom, typescript (+7 more)

### Community 24 - "app/layout.tsx"
Cohesion: 0.05
Nodes (36): DashboardPage(), DashboardPresensiPage(), emptyForm, FormData, Modal, ROLE_OPTIONS, ConfirmDialog(), Modal (+28 more)

### Community 25 - "table.tsx"
Cohesion: 0.11
Nodes (17): TabKarakter(), TabKarakterProps, TabKeaktifan(), TabKeaktifanProps, TabLitnum(), TabLitnumProps, TabNilaiHarian(), TabNilaiHarianProps (+9 more)

### Community 26 - "useRekapNilaiAkhir.ts"
Cohesion: 0.31
Nodes (9): DashboardClient(), Props, AttendanceDonutChart, GuruDashboardView(), TeacherSummary, useTeacherChart(), AttendanceMapValue, AttendanceRow (+1 more)

### Community 27 - "kelola-mapel/page.tsx"
Cohesion: 0.20
Nodes (7): AssignModal(), ConfirmDeleteModalProps, Modal, Modal, SubjectModal(), SubjectModalProps, MasterMapelPage()

### Community 28 - "AdminDashboardView.tsx"
Cohesion: 0.21
Nodes (8): AdminDashboardView(), CARDS, DashboardStatCards(), Props, StatCardKey, Props, DashboardSummary, useDashboard()

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

### Community 36 - "Pagination.tsx"
Cohesion: 0.21
Nodes (7): RecentActivities(), RecentActivitiesProps, RecentActivity, Modal, PaginationProps, TruncatedTextWithInfo(), TruncatedTextWithInfoProps

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
Cohesion: 0.11
Nodes (13): Modal, Modal, ProgressBadge(), ProgressBadgeProps, PageHeroProps, Props, EmptyStateProps, ErrorStateProps (+5 more)

### Community 43 - ".getAll"
Cohesion: 0.31
Nodes (5): RekapPresensi(), ExportWordButton(), useDashboardPresensi(), useHolidays(), usePresensi()

### Community 57 - "IncompleteDataWidget.tsx"
Cohesion: 0.15
Nodes (12): AttendanceTrendChart, AttendanceTrendWidget(), AttendanceTrendWidgetProps, PresensiStatCards(), PresensiStatCardsProps, AttendanceDonutChart, MasterKonfigurasiNilaiPage(), AVAILABLE_YEARS (+4 more)

### Community 58 - "lib/api.ts"
Cohesion: 0.25
Nodes (6): DashboardKarakterPage(), getScoreColor(), PenilaianKarakterPage(), useCharacterAssessment(), useDashboardKarakter(), CharacterAssessmentService

### Community 60 - "holiday.service.ts"
Cohesion: 0.29
Nodes (5): PresensiMuridPage(), HolidayItem, HolidayService, Holiday, HolidayCheckResult

### Community 70 - "useDashboardPresensi.ts"
Cohesion: 0.39
Nodes (6): MonthlyPresensiPoster, Props, AttendanceSummary, GradeAttendanceRow, StudentAbsenceRow, ViewMode

### Community 81 - "PresensiTable.tsx"
Cohesion: 0.33
Nodes (5): Props, STATUS_LIST, Entry, STATUS_BTN, STATUS_LABEL

### Community 85 - "export-presensi-csv.ts"
Cohesion: 0.16
Nodes (22): RekapKarapkterPage(), ExportImageButton(), Props, Props, RekapKarakterTable(), RecapRow, useRekapKarakter(), downloadCSV() (+14 more)

### Community 86 - "dashboard-akademik/page.tsx"
Cohesion: 0.25
Nodes (5): NilaiStatCards(), NilaiStatCardsProps, GlassColors, SimpleColors, StatCardProps

### Community 87 - "cn"
Cohesion: 0.15
Nodes (15): dataKelulusan, dataKelulusanType, Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription() (+7 more)

### Community 91 - "MonthlyPresensiView.tsx"
Cohesion: 0.16
Nodes (9): DistribusiStatus(), DistribusiStatusProps, InsightTable(), ABSEN_COLOR(), AttendanceBarChart, MonthlyPresensiView(), MonthlyPresensiViewProps, RATE_COLOR() (+1 more)

### Community 92 - "holiday.service.ts"
Cohesion: 0.32
Nodes (5): ChecklistItem, formatCategoryLabel(), formatDayDate(), IncompleteDataWidget(), IncompleteDataWidgetProps

### Community 95 - "README.md"
Cohesion: 0.33
Nodes (5): Dashboard Admin (`/dashboard`), Deploy on Vercel, Fitur Utama, Getting Started, Learn More

### Community 96 - "detail/page.tsx"
Cohesion: 0.31
Nodes (5): dataTKA, getGrade(), HasilTKA(), DataFieldProps, gradeColors

### Community 97 - "kelas-5/page.tsx"
Cohesion: 0.32
Nodes (4): menuItems, JumlahMurid(), NamaMurid(), WaliKelas()

## Knowledge Gaps
- **267 isolated node(s):** `Modal`, `NilaiStatCardsProps`, `RecentActivity`, `RecentActivitiesProps`, `AttendanceTrendChart` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `app/layout.tsx` to `select.tsx`, `login/page.tsx`, `useAssessmentScore.ts`, `student-savings.service.ts`, `character-assessment.service.ts`, `komponen-nilai/page.tsx`, `NoteCard.tsx`, `useNilaiHarian`, `pmb/page.tsx`, `cn`, `detail/page.tsx`, `grade-subject.service.ts`, `useRekapNilaiAkhir.ts`, `useAuth`, `.getAll`, `IncompleteDataWidget.tsx`, `lib/api.ts`, `export-presensi-csv.ts`, `dashboard-akademik/page.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `clsx`, `package.json`, `react`, `react-hot-toast`, `recharts`, `shadcn`, `tailwind-merge`, `@tiptap/starter-kit`, `tw-animate-css`, `xlsx`, `class-variance-authority`, `lucide-react`, `next`, `html-to-image`, `kelas-5/page.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `xlsx` connect `xlsx` to `useAssessmentScore.ts`, `student-savings.service.ts`, `dependencies`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `Modal`, `NilaiStatCardsProps`, `RecentActivity` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAssessmentScore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05462962962962963 - nodes in this community are weakly interconnected._
- **Should `student-savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050957481337228175 - nodes in this community are weakly interconnected._
- **Should `character-assessment.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
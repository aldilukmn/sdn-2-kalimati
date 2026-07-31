# Graph Report - sdn-2-kalimati  (2026-07-29)

## Corpus Check
- 278 files · ~125,500 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1155 nodes · 2773 edges · 103 communities (69 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5919f7ff`
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
- pmb/page.tsx
- data-pendaftar/page.tsx
- data-gtk/page.tsx
- useAuth
- export-presensi-csv.ts
- dashboard-akademik/page.tsx
- cn
- character-assessment.service.ts
- UserService
- MasterStudentType
- MonthlyPresensiView.tsx
- holiday.service.ts
- app/layout.tsx
- CharacterAssessmentService
- README.md
- detail/page.tsx
- kelas-5/page.tsx
- usePresensi.ts
- constants.ts
- history/page.tsx
- problems.md
- kelas-5/data/index.ts

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

## Communities (103 total, 34 thin omitted)

### Community 0 - "select.tsx"
Cohesion: 0.21
Nodes (19): Modal, SavingsTrendChart, Modal, AssignModalProps, Modal, Modal, DEFAULT_YEARS, YearSelect() (+11 more)

### Community 1 - "student-attendance.service.ts"
Cohesion: 0.33
Nodes (7): AttendanceSummary, GradeAttendanceRow, StudentAbsenceRow, ViewMode, AttendanceReportItem, StudentAttendanceRequestType, StudentAttendanceType

### Community 2 - "login/page.tsx"
Cohesion: 0.18
Nodes (12): ComponentBreakdown(), ComponentBreakdownProps, StudentRanking(), StudentRankingProps, DashboardNilaiPage(), getInitialAcademicYear(), getInitialSemester(), useDashboardNilai() (+4 more)

### Community 3 - "useAssessmentScore.ts"
Cohesion: 0.07
Nodes (27): NilaiLitnumPage(), PenilaianPage(), useAssessmentConfig(), KarakterStudent, useKarakterData(), useKeaktifanData(), useLitnumData(), useNonHarianData() (+19 more)

### Community 4 - "student-savings.service.ts"
Cohesion: 0.06
Nodes (43): TabunganSection(), TabunganMuridPage(), MONTHS_SHORT, Props, SavingsTrendChart(), LoadingDots(), ModalProps, ConfirmDeleteModalProps (+35 more)

### Community 5 - "character-assessment.service.ts"
Cohesion: 0.14
Nodes (14): KonfigurasiKaihPage(), Modal, HabitRadioGroup(), HabitRadioGroupProps, OPTIONS, Props, StudentRow, StudentScore (+6 more)

### Community 6 - "IncompleteDataWidget.tsx"
Cohesion: 0.29
Nodes (9): Props, AttendanceDonutChart, GuruDashboardView(), TeacherSummary, useTeacherDashboard(), useTeacherChart(), AttendanceMapValue, AttendanceRow (+1 more)

### Community 7 - "Refactoring Roadmap (20 Items)"
Cohesion: 0.07
Nodes (34): lib/api.ts API Client, ApiResponse T Type, DashboardSidebar Component, DateDayPicker Component, Dual Token Auth (sessionStorage + cookie), GRADES Constant, Holiday System, ITEMS_PER_PAGE Constant (+26 more)

### Community 8 - "komponen-nilai/page.tsx"
Cohesion: 0.20
Nodes (9): Props, ScoreService, BulkScoreRequest, Chapter, ChapterProgress, ClassAverageItem, RekapEntry, RekapMaterialDetail (+1 more)

### Community 9 - "Pagination.tsx"
Cohesion: 0.14
Nodes (9): gameLinks, dataTKA, getGrade(), HasilTKA(), dataKelulusan, dataKelulusanType, tariLinks, TypeTariLinks (+1 more)

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
Cohesion: 0.19
Nodes (10): MasterStrukturPage(), useChapters(), ChapterService, MaterialService, ChapterCreateRequest, ChapterUpdateRequest, Material, MaterialCreateRequest (+2 more)

### Community 15 - "StudentDataStep.tsx"
Cohesion: 0.13
Nodes (15): DatePickerFieldProps, InputField, InputFieldProps, SelectField, SelectFieldProps, GuardianDataStepProps, ParentDataStepProps, StudentDataStepProps (+7 more)

### Community 16 - "DashboardSidebar.tsx"
Cohesion: 0.18
Nodes (11): DashboardSidebar(), SidebarProps, useAssessmentConfig(), useSidebarData(), guruAllowedHrefs, MenuGroup, MenuItem, menuItems (+3 more)

### Community 17 - "cn"
Cohesion: 0.26
Nodes (13): DailyPresensiView(), AssignTabProps, SubjectsTabProps, WeeklyRecapTable(), WeeklyRecapTableProps, Table(), TableBody(), TableCell() (+5 more)

### Community 18 - "data-pendaftar/page.tsx"
Cohesion: 0.21
Nodes (8): AdminDashboardView(), CARDS, DashboardStatCards(), Props, StatCardKey, Props, DashboardSummary, useDashboard()

### Community 19 - "grade-subject.service.ts"
Cohesion: 0.17
Nodes (10): useSubjects(), GradeSubjectService, SubjectService, BulkGradeSubjectCreateRequest, GradeSubject, GradeSubjectCreateRequest, GradeSubjectUpdateRequest, Subject (+2 more)

### Community 20 - "dependencies"
Cohesion: 0.12
Nodes (17): @base-ui/react, canvas-confetti, gsap, dependencies, @base-ui/react, canvas-confetti, gsap, react-day-picker (+9 more)

### Community 21 - "nilai-harian.ts"
Cohesion: 0.21
Nodes (9): TabNonHarianProps, Props, ACADEMIC_YEARS, SEMESTERS, AssessmentConfigCreateRequest, AssessmentComponent, AssessmentConfig, BulkScoreItem (+1 more)

### Community 22 - "Sprint 3: Input Nilai Harian"
Cohesion: 0.23
Nodes (17): Assessment Module (Phase 2), Sprint Dependency Graph, Nilai Harian Module (Phase 1), Sprint 1: Master Mapel, Sprint 2: Struktur Akademik, Sprint 3: Input Nilai Harian, Sprint 4: Rekap Nilai Harian, Sprint 5: UX Enhancement (+9 more)

### Community 23 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react, @types/react-dom, typescript (+7 more)

### Community 24 - "app/layout.tsx"
Cohesion: 0.15
Nodes (13): DashboardClient(), DashboardPage(), AdminLayout(), metadata, ProfileView(), Props, ROLE_COLORS, ROLE_LABELS (+5 more)

### Community 25 - "table.tsx"
Cohesion: 0.11
Nodes (17): TabKarakter(), TabKarakterProps, TabKeaktifan(), TabKeaktifanProps, TabLitnum(), TabLitnumProps, TabNilaiHarian(), TabNilaiHarianProps (+9 more)

### Community 26 - "useRekapNilaiAkhir.ts"
Cohesion: 0.19
Nodes (13): NilaiAkhirPage(), RekapNilaiAkhirPage(), Props, useFinalScore(), MatrixRow, SubjectColumn, useRekapNilaiAkhir(), ACADEMIC_YEARS (+5 more)

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
Cohesion: 0.13
Nodes (9): Modal, Modal, PageHeroProps, EmptyStateProps, ErrorStateProps, FilterBarProps, FilterConfig, LoadingSkeletonProps (+1 more)

### Community 43 - ".getAll"
Cohesion: 0.29
Nodes (6): NilaiHarianPage(), RekapNilaiPage(), useHarianData(), useNilaiHarian(), useRekapNilai(), GradeSubjectQueryParams

### Community 57 - "IncompleteDataWidget.tsx"
Cohesion: 0.14
Nodes (14): AttendanceTrendChart, AttendanceTrendWidget(), AttendanceTrendWidgetProps, PresensiStatCards(), PresensiStatCardsProps, AttendanceDonutChart, Modal, DateDayPicker() (+6 more)

### Community 58 - "lib/api.ts"
Cohesion: 0.36
Nodes (4): api(), getCookie(), ApiResponse, ApiStatus

### Community 60 - "date-fns"
Cohesion: 0.40
Nodes (4): DashboardShell(), Props, DashboardNavbar(), NavbarProps

### Community 81 - "pmb/page.tsx"
Cohesion: 0.15
Nodes (11): EditRegistration(), emptyForm, initialFormData, Pmb(), RegistrationCard(), RegistrationCounter(), LoadingModal(), LoadingModalProps (+3 more)

### Community 82 - "data-pendaftar/page.tsx"
Cohesion: 0.22
Nodes (12): DataPendaftar(), formatDateTime(), HolidayInfoCard(), HolidayInfoCardProps, formatDateID(), printRegistrantForm(), Address, Guardian (+4 more)

### Community 83 - "data-gtk/page.tsx"
Cohesion: 0.21
Nodes (8): emptyForm, FormData, Modal, ROLE_OPTIONS, ConfirmDialog(), Modal, TeacherType, User

### Community 84 - "useAuth"
Cohesion: 0.20
Nodes (8): DashboardPresensiPage(), RekapPresensi(), ExportWordButton(), useAssessmentStudents(), useDashboardPresensi(), usePresensi(), exportPresensiMatriksToWord(), StudentAttendanceService

### Community 85 - "export-presensi-csv.ts"
Cohesion: 0.26
Nodes (13): RekapKarapkterPage(), downloadCSV(), wrap(), exportRegistrantsToCSV(), formatDate(), HEADERS, AttendanceRecapRow, AttendanceRow (+5 more)

### Community 86 - "dashboard-akademik/page.tsx"
Cohesion: 0.14
Nodes (9): NilaiStatCards(), NilaiStatCardsProps, RecentActivities(), RecentActivitiesProps, RecentActivity, PaginationProps, GlassColors, SimpleColors (+1 more)

### Community 87 - "cn"
Cohesion: 0.21
Nodes (13): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+5 more)

### Community 88 - "character-assessment.service.ts"
Cohesion: 0.24
Nodes (9): Props, RecentAssessment, RecapRow, AssessmentCreateRequest, AssessmentListItem, AssessmentUpdateRequest, CharacterAssessment, HabitEntry (+1 more)

### Community 90 - "MasterStudentType"
Cohesion: 0.42
Nodes (3): DataMuridPage(), MasterStudentService, MasterStudentType

### Community 91 - "MonthlyPresensiView.tsx"
Cohesion: 0.16
Nodes (9): DistribusiStatus(), DistribusiStatusProps, InsightTable(), ABSEN_COLOR(), AttendanceBarChart, MonthlyPresensiView(), MonthlyPresensiViewProps, RATE_COLOR() (+1 more)

### Community 92 - "holiday.service.ts"
Cohesion: 0.15
Nodes (11): ChecklistItem, formatCategoryLabel(), formatDayDate(), IncompleteDataWidget(), IncompleteDataWidgetProps, PresensiMuridPage(), HolidayItem, useHolidays() (+3 more)

### Community 93 - "app/layout.tsx"
Cohesion: 0.19
Nodes (11): geist, metadata, poppins, RootLayout(), ThemeProvider(), AuthContext, AuthContextType, AuthProvider() (+3 more)

### Community 94 - "CharacterAssessmentService"
Cohesion: 0.22
Nodes (7): DashboardKarakterPage(), KarakterDetailPage(), PenilaianKarakterPage(), useCharacterAssessment(), useDashboardKarakter(), useRekapKarakter(), CharacterAssessmentService

### Community 95 - "README.md"
Cohesion: 0.33
Nodes (5): Dashboard Admin (`/dashboard`), Deploy on Vercel, Fitur Utama, Getting Started, Learn More

### Community 96 - "detail/page.tsx"
Cohesion: 0.22
Nodes (5): HabitDisplay, SCORE_COLORS, VALUE_COLORS, DataFieldProps, gradeColors

### Community 97 - "kelas-5/page.tsx"
Cohesion: 0.32
Nodes (4): menuItems, JumlahMurid(), NamaMurid(), WaliKelas()

### Community 98 - "usePresensi.ts"
Cohesion: 0.39
Nodes (5): Props, STATUS_LIST, Entry, STATUS_BTN, STATUS_LABEL

### Community 99 - "constants.ts"
Cohesion: 0.38
Nodes (5): MasterKonfigurasiNilaiPage(), COMPONENT_BGS, COMPONENT_COLORS, CONFIG_PRESETS, ConfigPreset

### Community 100 - "history/page.tsx"
Cohesion: 0.50
Nodes (3): getScoreColor(), KarakterHistoryPage(), SCORE_COLORS

## Knowledge Gaps
- **266 isolated node(s):** `Modal`, `NilaiStatCardsProps`, `RecentActivity`, `RecentActivitiesProps`, `AttendanceTrendChart` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `app/layout.tsx` to `select.tsx`, `login/page.tsx`, `useAssessmentScore.ts`, `student-savings.service.ts`, `character-assessment.service.ts`, `IncompleteDataWidget.tsx`, `komponen-nilai/page.tsx`, `NoteCard.tsx`, `useNilaiHarian`, `pmb/page.tsx`, `DashboardSidebar.tsx`, `cn`, `useRekapNilaiAkhir.ts`, `useAuth`, `.getAll`, `IncompleteDataWidget.tsx`, `date-fns`, `data-pendaftar/page.tsx`, `data-gtk/page.tsx`, `useAuth`, `dashboard-akademik/page.tsx`, `UserService`, `MasterStudentType`, `CharacterAssessmentService`, `usePresensi.ts`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `xlsx` connect `xlsx` to `MasterStudentType`, `student-savings.service.ts`, `dependencies`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `clsx`, `package.json`, `react`, `react-hot-toast`, `recharts`, `shadcn`, `lucide-react`, `tailwind-merge`, `@tiptap/starter-kit`, `tw-animate-css`, `xlsx`, `lib/api.ts`, `next`, `html-to-image`, `kelas-5/page.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **What connects `Modal`, `NilaiStatCardsProps`, `RecentActivity` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAssessmentScore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07168458781362007 - nodes in this community are weakly interconnected._
- **Should `student-savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060694579681921455 - nodes in this community are weakly interconnected._
- **Should `character-assessment.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._
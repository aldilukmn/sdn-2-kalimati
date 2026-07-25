# Graph Report - D:\Website\sdn-2-kalimati  (2026-07-25)

## Corpus Check
- 270 files · ~121,377 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1110 nodes · 2680 edges · 81 communities (49 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Dashboard & Admin Tools
- Student Data & Attendance
- Dashboard Client & GTK
- Student Assessment System
- Tabungan & Savings Charts
- Character Assessment
- Dashboard View Components
- Documentation & Types
- Score Component Tabs
- Public Pages & Games
- TypeScript References
- Notes Module
- Daily Score Management
- Component Library Setup
- Student Registration PMB
- Form Input Components
- Layout & Sidebar
- UI Primitives
- Registrant Data View
- Hooks & Subject Management
- Admin Layout Shell
- Auth & Context
- API Client & Services
- Savings Grade Recap
- Subject Management
- Assessment Score Editing
- Dashboard Loading & Error
- Savings Weekly Recap
- Chapter & Material Service
- Export & CSV Utils
- Daily Transaction Modal
- Presensi Table & Badges
- Character Detail & History
- Score Table Components
- Utility & Format Helpers
- Grade Subject Assignment
- Pagination & Filter
- Assessment Score Services
- Tugas & Task Management
- Nilai Akhir & Final Score
- Sidebar Navigation Data
- Core App Layout
- Character Habits Service
- Theme Provider & Config
- Dashboard Navigation
- Profile Views
- FilterBar & EmptyState
- Login & Auth Flow
- Student List Data
- Master Student Service
- Literacy Numeracy Module
- Dashboards Presensi Stats
- Savings Edit Transaction
- Savings History Modal
- Presensi Data Hooks
- Teacher Chart Hooks
- Character Assessment Hooks
- Delete Transaction Hook
- Rekap Nilai Akhir Hook
- Sidebar Monthly Overview
- Rekap Nilai Harian Hook
- Student Monthly Breakdown
- Savings Recap Dashboard
- Teacher Dashboard Hook
- Password Reset Modal
- Nilai Litnum Page
- Nilai Harian Rekap Table
- Dashboard Karakter Hook
- Dashboard Presensi Hook
- Edit Registration Form
- Assessment Config Service
- Final Score Service
- Task Score Service

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 50 edges
2. `cn()` - 32 edges
3. `api()` - 26 edges
4. `GRADES` - 25 edges
5. `SelectGroup()` - 21 edges
6. `SelectValue()` - 21 edges
7. `SelectTrigger()` - 21 edges
8. `SelectContent()` - 21 edges
9. `SelectItem()` - 21 edges
10. `StudentAttendanceService` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Conventional Commits Format` --semantically_similar_to--> `FE + BE Git Workflow`  [INFERRED] [semantically similar]
  docs/git/commit-rules.md → .gemini/rules/git-workflow.md
- `MasterMapelPage()` --calls--> `useSubjects()`  [EXTRACTED]
  app/(admin)/kelola-mapel/page.tsx → hooks/useSubjects.ts
- `TabNonHarianProps` --references--> `AssessmentComponent`  [EXTRACTED]
  app/(admin)/komponen-nilai/components/TabNonHarian.tsx → types/nilai-harian.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `StudentDataStepProps` --references--> `RegistrationForm`  [EXTRACTED]
  components/pmb/StudentDataStep.tsx → types/registration.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Known Issue Cluster** — agents_n_plus_one_api_calls, agents_missing_loading_tsx, agents_known_issues [EXTRACTED 1.00]
- **Sprint Dependency Chain** — docs_sprint_plan_sprint_1, docs_sprint_plan_sprint_2, docs_sprint_plan_sprint_3, docs_sprint_plan_sprint_4, docs_sprint_plan_sprint_5, docs_sprint_plan_sprint_6, docs_sprint_plan_sprint_7, docs_sprint_plan_sprint_8, docs_sprint_plan_sprint_9, docs_sprint_plan_dependency_graph [EXTRACTED 1.00]
- **Refactor Phase Sequence** — docs_fe_refactor_plan_phase_1, docs_fe_refactor_plan_phase_2, docs_fe_refactor_plan_phase_3, docs_fe_refactor_plan_phase_4, docs_fe_refactor_plan_phase_5, docs_fe_refactor_plan_phase_6, docs_fe_refactor_plan_phase_7 [EXTRACTED 1.00]
- **Refactoring Roadmap Cluster** — agents_refactoring_roadmap, agents_statcard, agents_pagehero, agents_modal, agents_grades_constant, agents_items_per_page, agents_type_cleanup, agents_tabungan_murid [EXTRACTED 1.00]

## Communities (81 total, 32 thin omitted)

### Community 0 - "Dashboard & Admin Tools"
Cohesion: 0.06
Nodes (67): Modal, SavingsTrendChart, TabunganSection(), DailyPresensiView(), DistribusiStatus(), DistribusiStatusProps, InsightTable(), ABSEN_COLOR() (+59 more)

### Community 1 - "Student Data & Attendance"
Cohesion: 0.06
Nodes (42): DataMuridPage(), PresensiMuridPage(), RekapKarapkterPage(), RekapPresensi(), ExportWordButton(), Props, STATUS_LIST, AttendanceSummary (+34 more)

### Community 2 - "Dashboard Client & GTK"
Cohesion: 0.05
Nodes (36): DashboardClient(), DashboardPage(), DashboardPresensiPage(), emptyForm, FormData, Modal, ROLE_OPTIONS, ConfirmDialog() (+28 more)

### Community 3 - "Student Assessment System"
Cohesion: 0.07
Nodes (28): NilaiLitnumPage(), PenilaianPage(), useAssessmentConfig(), useAssessmentStudents(), KarakterStudent, useKarakterData(), useKeaktifanData(), useLitnumData() (+20 more)

### Community 4 - "Tabungan & Savings Charts"
Cohesion: 0.06
Nodes (38): TabunganMuridPage(), MONTHS_SHORT, Props, SavingsTrendChart(), LoadingDots(), DailyTabProps, EditModal(), EditModalProps (+30 more)

### Community 5 - "Character Assessment"
Cohesion: 0.06
Nodes (35): DashboardKarakterPage(), KonfigurasiKaihPage(), Modal, HabitDisplay, KarakterDetailPage(), SCORE_COLORS, VALUE_COLORS, getScoreColor() (+27 more)

### Community 6 - "Dashboard View Components"
Cohesion: 0.08
Nodes (29): Props, AdminDashboardView(), AttendanceDonutChart, GuruDashboardView(), ChecklistItem, formatCategoryLabel(), formatDayDate(), IncompleteDataWidget() (+21 more)

### Community 7 - "Documentation & Types"
Cohesion: 0.07
Nodes (34): lib/api.ts API Client, ApiResponse T Type, DashboardSidebar Component, DateDayPicker Component, Dual Token Auth (sessionStorage + cookie), GRADES Constant, Holiday System, ITEMS_PER_PAGE Constant (+26 more)

### Community 8 - "Score Component Tabs"
Cohesion: 0.09
Nodes (20): TabKarakter(), TabKarakterProps, TabKeaktifan(), TabKeaktifanProps, TabLitnum(), TabLitnumProps, TabNilaiHarian(), TabNilaiHarianProps (+12 more)

### Community 9 - "Public Pages & Games"
Cohesion: 0.09
Nodes (15): gameLinks, dataTKA, getGrade(), HasilTKA(), dataKelulusan, dataKelulusanType, tariLinks, TypeTariLinks (+7 more)

### Community 10 - "TypeScript References"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 11 - "Notes Module"
Cohesion: 0.12
Nodes (12): CatatanPage(), NoteCard(), NoteCardProps, RichTextEditorProps, ModalProps, ConfirmDeleteModalProps, useNotes(), formatDateWithDayID() (+4 more)

### Community 12 - "Daily Score Management"
Cohesion: 0.14
Nodes (11): NilaiHarianPage(), RekapNilaiPage(), useHarianData(), useChapters(), useNilaiHarian(), useRekapNilai(), ChapterService, MaterialService (+3 more)

### Community 13 - "Component Library Setup"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 14 - "Student Registration PMB"
Cohesion: 0.17
Nodes (11): EditRegistration(), emptyForm, initialFormData, Pmb(), RegistrationCard(), RegistrationCounter(), LoadingModal(), LoadingModalProps (+3 more)

### Community 15 - "Form Input Components"
Cohesion: 0.16
Nodes (11): DatePickerFieldProps, InputField, InputFieldProps, SelectField, SelectFieldProps, StudentDataStepProps, EDUCATION_OPTIONS, GENDER_OPTIONS (+3 more)

### Community 16 - "Layout & Sidebar"
Cohesion: 0.18
Nodes (11): DashboardSidebar(), SidebarProps, useAssessmentConfig(), useSidebarData(), guruAllowedHrefs, MenuGroup, MenuItem, menuItems (+3 more)

### Community 17 - "UI Primitives"
Cohesion: 0.18
Nodes (15): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+7 more)

### Community 18 - "Registrant Data View"
Cohesion: 0.20
Nodes (12): DataPendaftar(), formatDateTime(), HolidayInfoCard(), HolidayInfoCardProps, formatDateID(), printRegistrantForm(), Address, Guardian (+4 more)

### Community 19 - "Hooks & Subject Management"
Cohesion: 0.23
Nodes (8): AssignTabProps, ACADEMIC_YEARS, SEMESTERS, GradeSubjectService, BulkGradeSubjectCreateRequest, GradeSubject, GradeSubjectCreateRequest, GradeSubjectUpdateRequest

### Community 20 - "Admin Layout Shell"
Cohesion: 0.12
Nodes (17): @base-ui/react, canvas-confetti, gsap, lucide-react, dependencies, @base-ui/react, canvas-confetti, gsap (+9 more)

### Community 21 - "Auth & Context"
Cohesion: 0.26
Nodes (11): Props, BulkScoreItem, Chapter, ChapterProgress, ClassAverageItem, Material, MaterialCreateRequest, MaterialUpdateRequest (+3 more)

### Community 22 - "API Client & Services"
Cohesion: 0.23
Nodes (17): Assessment Module (Phase 2), Sprint Dependency Graph, Nilai Harian Module (Phase 1), Sprint 1: Master Mapel, Sprint 2: Struktur Akademik, Sprint 3: Input Nilai Harian, Sprint 4: Rekap Nilai Harian, Sprint 5: UX Enhancement (+9 more)

### Community 23 - "Savings Grade Recap"
Cohesion: 0.13
Nodes (15): devDependencies, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti, @types/node, @types/react, @types/react-dom, typescript (+7 more)

### Community 24 - "Subject Management"
Cohesion: 0.19
Nodes (11): geist, metadata, poppins, RootLayout(), ThemeProvider(), AuthContext, AuthContextType, AuthProvider() (+3 more)

### Community 25 - "Assessment Score Editing"
Cohesion: 0.24
Nodes (6): SubjectsTabProps, useSubjects(), SubjectService, Subject, SubjectCreateRequest, SubjectUpdateRequest

### Community 26 - "Dashboard Loading & Error"
Cohesion: 0.30
Nodes (7): NilaiAkhirPage(), useFinalScore(), useRekapNilaiAkhir(), FinalScoreService, CalculateResponse, ComponentScoreDto, FinalScoreEntry

### Community 27 - "Savings Weekly Recap"
Cohesion: 0.20
Nodes (7): AssignModal(), ConfirmDeleteModalProps, Modal, Modal, SubjectModal(), SubjectModalProps, MasterMapelPage()

### Community 28 - "Chapter & Material Service"
Cohesion: 0.29
Nodes (5): MasterStrukturPage(), api(), getCookie(), ApiResponse, ApiStatus

### Community 29 - "Export & CSV Utils"
Cohesion: 0.33
Nodes (9): config, decodeBase64(), decodeJWTPayload(), GRADUATION_ANNOUNCEMENT_DATE, isTokenExpired(), proxy(), redirectToForbidden(), redirectToLogin() (+1 more)

### Community 30 - "Daily Transaction Modal"
Cohesion: 0.28
Nodes (5): GRADUATION_ANNOUNCEMENT_DATE, GraduationCountdownModal, navigationLinks, TextType(), TextTypeProps

### Community 31 - "Presensi Table & Badges"
Cohesion: 0.32
Nodes (4): menuItems, JumlahMurid(), NamaMurid(), WaliKelas()

### Community 32 - "Character Detail & History"
Cohesion: 0.36
Nodes (3): ScoreService, BulkScoreRequest, Score

### Community 33 - "Score Table Components"
Cohesion: 0.25
Nodes (7): name, private, scripts, build, dev, start, version

### Community 34 - "Utility & Format Helpers"
Cohesion: 0.38
Nodes (6): AttendanceBarChart(), GRADE_COLORS, Props, RECHARTS_PROPS, sanitizeDOMProps(), SKELETON_HEIGHTS

### Community 35 - "Grade Subject Assignment"
Cohesion: 0.38
Nodes (6): getRateColor(), Props, RATE_COLORS, STATUS_COLUMNS, StudentAttendanceTable(), StudentRow

### Community 36 - "Pagination & Filter"
Cohesion: 0.43
Nodes (5): ACADEMIC_YEARS, SEMESTERS, AssessmentConfigCreateRequest, AssessmentComponent, AssessmentConfig

### Community 37 - "Assessment Score Services"
Cohesion: 0.33
Nodes (3): daftarKelas, dataSiswa, Siswa

### Community 38 - "Tugas & Task Management"
Cohesion: 0.40
Nodes (3): CURRENT_YEAR, MONTHS, MonthYearPickerProps

### Community 39 - "Nilai Akhir & Final Score"
Cohesion: 0.40
Nodes (3): ITEMS, Props, StatusCardItem

### Community 40 - "Sidebar Navigation Data"
Cohesion: 0.50
Nodes (3): GuardianDataStepProps, ParentDataStepProps, RegistrationForm

## Knowledge Gaps
- **253 isolated node(s):** `Modal`, `DistribusiStatusProps`, `AttendanceTrendChart`, `AttendanceBarChart`, `MonthlyPresensiViewProps` (+248 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Dashboard Client & GTK` to `Dashboard & Admin Tools`, `Student Data & Attendance`, `Student Assessment System`, `Tabungan & Savings Charts`, `Character Assessment`, `Dashboard View Components`, `Notes Module`, `Daily Score Management`, `Layout & Sidebar`, `Registrant Data View`, `Hooks & Subject Management`, `Auth & Context`, `Dashboard Loading & Error`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `xlsx` connect `Nilai Litnum Page` to `Student Data & Attendance`, `Tabungan & Savings Charts`, `Admin Layout Shell`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Admin Layout Shell` to `Score Table Components`, `Delete Transaction Hook`, `Rekap Nilai Akhir Hook`, `Sidebar Monthly Overview`, `Rekap Nilai Harian Hook`, `Student Monthly Breakdown`, `Savings Recap Dashboard`, `Teacher Dashboard Hook`, `Password Reset Modal`, `Nilai Litnum Page`, `Master Student Service`, `Literacy Numeracy Module`, `Savings Edit Transaction`, `Presensi Data Hooks`, `Teacher Chart Hooks`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `Modal`, `DistribusiStatusProps`, `AttendanceTrendChart` to the rest of the system?**
  _253 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard & Admin Tools` be split into smaller, more focused modules?**
  _Cohesion score 0.05701587301587301 - nodes in this community are weakly interconnected._
- **Should `Student Data & Attendance` be split into smaller, more focused modules?**
  _Cohesion score 0.0594679186228482 - nodes in this community are weakly interconnected._
- **Should `Dashboard Client & GTK` be split into smaller, more focused modules?**
  _Cohesion score 0.05134575569358178 - nodes in this community are weakly interconnected._
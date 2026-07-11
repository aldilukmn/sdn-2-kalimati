21:07:11.009 Running build in Washington, D.C., USA (East) – iad1
21:07:11.010 Build machine configuration: 2 cores, 8 GB
21:07:11.203 Cloning github.com/aldilukmn/sdn-2-kalimati (Branch: main, Commit: 5b414ae)
21:07:12.482 Cloning completed: 1.279s
21:07:13.300 Restored build cache from previous deployment (2sW8HcN8SHPQ772n358X6iyNfWbw)
21:07:14.497 Running "vercel build"
21:07:14.522 Vercel CLI 55.0.0
21:07:15.645 Installing dependencies...
21:07:17.053 
21:07:17.054 up to date in 1s
21:07:17.055 
21:07:17.055 126 packages are looking for funding
21:07:17.055   run `npm fund` for details
21:07:17.099 Detected Next.js version: 16.2.6
21:07:17.104 Running "npm run build"
21:07:17.350 
21:07:17.351 > sdn-2-kalimati@0.1.0 build
21:07:17.351 > next build --turbopack
21:07:17.352 
21:07:18.477   Applying modifyConfig from Vercel
21:07:18.497 ▲ Next.js 16.2.6 (Turbopack)
21:07:18.498 
21:07:18.582   Creating an optimized production build ...
21:07:44.230 ✓ Compiled successfully in 25.1s
21:07:44.248   Running TypeScript ...
21:08:00.853 Failed to type check.
21:08:00.853 
21:08:00.855 ./app/(admin)/dashboard-karakter/page.tsx:45:5
21:08:00.855 Type error: Property 'totalHabits' does not exist on type '{ semester: string; setSemester: Dispatch<SetStateAction<string>>; academicYear: string; setAcademicYear: Dispatch<SetStateAction<string>>; ... 15 more ...; ACADEMIC_YEARS: string[]; }'.
21:08:00.855 
21:08:00.856   43 |     distribution,
21:08:00.856   44 |     recentAssessments,
21:08:00.856 > 45 |     totalHabits,
21:08:00.856      |     ^
21:08:00.857   46 |     loading, initialLoading, error, retry,
21:08:00.857   47 |     hasData,
21:08:00.857   48 |     SEMESTERS, ACADEMIC_YEARS,
21:08:00.912 Next.js build worker exited with code: 1 and signal: null
21:08:00.993 Error: Command "npm run build" exited with 1
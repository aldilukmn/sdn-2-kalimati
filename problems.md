

1/1

Next.js 16.2.6 (stale)
Turbopack
Recoverable Error


Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


+
Client
-
Server
  ...
    <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
      <RedirectBoundary>
        <RedirectErrorBoundary router={{...}}>
          <InnerLayoutRouter url="/presensi" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
            <SegmentViewNode type="page" pagePath="presensi/p...">
              <SegmentTrieNode>
              <ClientPageRoot Component={function PresensiPage} serverProvidedParams={{...}}>
                <PresensiPage params={Promise} searchParams={Promise}>
                  <div className="flex flex-...">
                    <div>
                    <Card className="w-full max...">
                      <div ref={null} data-testid="flowbite-card" href={undefined} className="flex round...">
                        <div className="flex h-ful...">
                          <div>
                          <div className="flex flex-...">
                            <div className="flex-1">
                              <label>
+                             <div
+                               className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm ..."
+                             >
-                             <select
-                               className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm o..."
-                             >
                            ...
                          ...
            ...
          ...
app/presensi/page.tsx (211:15) @ PresensiPage


  209 |             </label>
  210 |             {userRole === "guru" ? (
> 211 |               <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm text-g...
      |               ^
  212 |                 Kelas {grade}
  213 |               </div>
  214 |             ) : (
Call Stack
13

Show 11 ignore-listed frame(s)
div
<anonymous>
PresensiPage
app/presensi/page.tsx (211:15)
1
2

Kembali

Logout
📋
Presensi Siswa Harian
Input kehadiran siswa per kelas

Kelas
Kelas 2
Tanggal

24/06/2026
Hadir: 25
Sakit: 0
Izin: 0
Alpha: 0
No	Nama Siswa	Student ID	Status Kehadiran
1	Abil Shidiq Arsalan	252601001	
Hadir
Sakit
Izin
Alpha
2	Abizar Wijaya	252601002	
Hadir
Sakit
Izin
Alpha
3	Ahmad Fahru Rozi	252601003	
Hadir
Sakit
Izin
Alpha
4	Ainur Silviani	252601004	
Hadir
Sakit
Izin
Alpha
5	Aisyah Fitri Nur Falah	252601005	
Hadir
Sakit
Izin
Alpha
6	Ajeng Kasalini	252601006	
Hadir
Sakit
Izin
Alpha
7	Akis Musafah	252601007	
Hadir
Sakit
Izin
Alpha
8	Alisa Ramadani	252601008	
Hadir
Sakit
Izin
Alpha
9	Daniswara Rahardian	252601009	
Hadir
Sakit
Izin
Alpha
10	Devano Hanuni	252601010	
Hadir
Sakit
Izin
Alpha
11	Dimas Angga Saputra	252601011	
Hadir
Sakit
Izin
Alpha
12	Dylan Permana	252601012	
Hadir
Sakit
Izin
Alpha
13	Falanisa Rofah	252601013	
Hadir
Sakit
Izin
Alpha
14	Hafizh Mauludin	252601014	
Hadir
Sakit
Izin
Alpha
15	Hanifatul Munawaroh	252601015	
Hadir
Sakit
Izin
Alpha
16	Muhamad Lutfi Azzizi	252601016	
Hadir
Sakit
Izin
Alpha
17	Muhammad Lutfi Khawas	252601017	
Hadir
Sakit
Izin
Alpha
18	Muhammad Sultan A'Dim	252601018	
Hadir
Sakit
Izin
Alpha
19	Mutahbar Maulana Putra	252601019	
Hadir
Sakit
Izin
Alpha
20	Nisa Handayani	252601020	
Hadir
Sakit
Izin
Alpha
21	Putri Amalia	252601021	
Hadir
Sakit
Izin
Alpha
22	Qiana Nafeeza Al-Azis	252601022	
Hadir
Sakit
Izin
Alpha
23	Rafata Praditya Gali	252601023	
Hadir
Sakit
Izin
Alpha
24	Rafiq Zhafran	252601024	
Hadir
Sakit
Izin
Alpha
25	Syafira Prastiyo	252601025	
Hadir
Sakit
Izin
Alpha
Simpan Presensi
Presensi Siswa - SDN 2 Kalimati
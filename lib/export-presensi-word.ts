import type { TeacherType } from "@/types/user";

export function exportPresensiMatriksToWord(
  grade: string,
  monthName: string,
  month: number,
  year: number,
  students: { studentId: string; name: string }[],
  matrix: Record<string, (string | null)[]>,
  daysInMonth: number,
  holidayMap: Map<string, string> = new Map(),
  base64Logo: string = "",
  teacher: TeacherType | null = null
) {
  const daysHeaderHtml = Array.from({ length: daysInMonth })
    .map((_, i) => {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      const isSunday = new Date(year, month - 1, i + 1).getDay() === 0;
      const isHoliday = isSunday || holidayMap.has(dateStr);
      const bg = isHoliday ? 'background-color: #fca5a5; color: #991b1b;' : '';
      return `<th style="padding: 2px; width: 20px; ${bg}">${i + 1}</th>`;
    })
    .join("");

  // Pre-calculate holiday blocks for colspan
  const holidaySpan = new Map<string, number>();
  const skipHolidayDates = new Set<string>();
  
  let currentBlockStart: string | null = null;
  let currentBlockDesc: string | null = null;
  let currentSpan = 0;

  for (let i = 0; i < daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
    const isHoliday = holidayMap.has(dateStr);
    
    if (isHoliday) {
      const desc = holidayMap.get(dateStr);
      if (currentBlockStart && currentBlockDesc === desc) {
        currentSpan++;
        skipHolidayDates.add(dateStr);
      } else {
        if (currentBlockStart) {
          holidaySpan.set(currentBlockStart, currentSpan);
        }
        currentBlockStart = dateStr;
        currentBlockDesc = desc || null;
        currentSpan = 1;
      }
    } else {
      if (currentBlockStart) {
        holidaySpan.set(currentBlockStart, currentSpan);
        currentBlockStart = null;
        currentBlockDesc = null;
        currentSpan = 0;
      }
    }
  }
  if (currentBlockStart) {
    holidaySpan.set(currentBlockStart, currentSpan);
  }

  const rowsHtml = students
    .map((student, idx) => {
      const isEvenRow = (idx + 1) % 2 === 0;
      const defaultBg = isEvenRow ? 'background-color: #D9E2F3;' : '';

      const studentDays = matrix[student.studentId] || Array(daysInMonth).fill(null);
      let sCount = 0;
      let iCount = 0;
      let aCount = 0;
      let hCount = 0;

      const daysHtml = studentDays
        .slice(0, daysInMonth)
        .map((status, i) => {
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const isSunday = new Date(year, month - 1, i + 1).getDay() === 0;
          const isHoliday = holidayMap.has(dateStr);

          if (skipHolidayDates.has(dateStr)) {
            return '';
          }
          
          if (isHoliday) {
            if (idx === 0) {
              const span = holidaySpan.get(dateStr) || 1;
              const desc = holidayMap.get(dateStr) || "LIBUR";
              const verticalDesc = desc.toUpperCase().split("").map(c => c === " " ? "&nbsp;" : c).join("<br/>");
              return `<td rowspan="${students.length}" colspan="${span}" style="background-color: #fee2e2; text-align: center; vertical-align: middle; color: #991b1b; font-weight: bold; font-size: 9px;">${verticalDesc}</td>`;
            } else {
              return ''; // Skip sel ini karena sudah ditutup oleh rowspan dari baris pertama
            }
          }

          const isSundayOrHoliday = isSunday || isHoliday;
          const bg = isSundayOrHoliday ? 'background-color: #fee2e2;' : defaultBg;

          if (status === "hadir") {
            hCount++;
            // Titik tebal untuk hadir
            return `<td style="font-weight: bold; font-size: 13px; line-height: 1; ${bg}">&#8226;</td>`;
          }
          if (status === "sakit") {
            sCount++;
            return `<td style="color: #FF8C00; font-weight: bold; ${bg}">S</td>`; // Orange (lebih tajam)
          }
          if (status === "izin") {
            iCount++;
            return `<td style="color: #0000FF; font-weight: bold; ${bg}">I</td>`; // Biru murni
          }
          if (status === "absen") {
            aCount++;
            return `<td style="color: #FF0000; font-weight: bold; ${bg}">A</td>`; // Merah murni
          }
          return `<td style="${bg}"></td>`;
        })
        .join("");

      const totalRecorded = hCount + sCount + iCount + aCount;
      let percentage = '-';
      let pctColor = '';

      if (totalRecorded > 0) {
        const pctValue = Math.round((hCount / totalRecorded) * 100);
        percentage = pctValue + '%';
        if (pctValue >= 95) {
          pctColor = 'color: #008000;'; // Hijau (Sangat Baik)
        } else if (pctValue >= 85) {
          pctColor = 'color: #000000;'; // Hitam (Baik/Normal)
        } else if (pctValue >= 75) {
          pctColor = 'color: #FF8C00;'; // Oranye (Kurang)
        } else {
          pctColor = 'color: #FF0000;'; // Merah (Sangat Kurang)
        }
      }

      return `
      <tr style="${defaultBg}">
        <td style="padding: 2px; ${defaultBg}">${idx + 1}</td>
        <td style="padding: 2px; text-align: left; white-space: nowrap; ${defaultBg}">&nbsp;&nbsp;${student.name}</td>
        ${daysHtml}
        <td style="padding: 2px; color: #FF8C00; font-weight: bold; ${defaultBg}">${sCount}</td>
        <td style="padding: 2px; color: #0000FF; font-weight: bold; ${defaultBg}">${iCount}</td>
        <td style="padding: 2px; color: #FF0000; font-weight: bold; ${defaultBg}">${aCount}</td>
        <td style="padding: 2px; font-weight: bold; ${defaultBg}">${hCount}</td>
        <td style="padding: 2px; font-weight: bold; ${pctColor} ${defaultBg}">${percentage}</td>
      </tr>
    `;
    })
    .join("");

  const romanGrades: Record<string, string> = { "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V", "6": "VI" };
  const gradeText = romanGrades[grade] || grade;

  const formatTeacherName = (t: TeacherType | null) => {
    if (!t || !t.fullName) return "Nama Guru Kelas";
    if (!t.title || t.title.trim() === "-" || t.title.trim() === "") {
      return t.fullName;
    }
    return `${t.fullName}, ${t.title}`;
  };

  const formatNIP = (t: TeacherType | null) => {
    if (!t || !t.nip || t.nip.trim() === "-" || t.nip.trim() === "") return "........................................";
    return t.nip;
  };

  let lastWorkingDate = daysInMonth;
  for (let d = daysInMonth; d >= 1; d--) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isSunday = new Date(year, month - 1, d).getDay() === 0;
    const isHoliday = holidayMap.has(dateStr);
    if (!isSunday && !isHoliday) {
      lastWorkingDate = d;
      break;
    }
  }

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Presensi Murid</title>
      <style>
        @page WordSection1 {
          size: 841.9pt 595.3pt; /* A4 Landscape */
          mso-page-orientation: landscape;
          margin: 28.35pt 36.0pt 28.35pt 36.0pt; /* Top: 1cm, Right: 1.27cm, Bottom: 1cm, Left: 1.27cm */
        }
        div.WordSection1 { page: WordSection1; }
        
        /* Reset Spacing Default Word */
        p, table, tr, td, th {
          margin: 0 !important;
          mso-margin-top-alt: 0 !important;
          mso-margin-bottom-alt: 0 !important;
          mso-padding-alt: 0 0 0 0 !important;
        }
        .holiday-text { font-size: 8px; font-weight: bold; mso-line-height-rule: exactly; line-height: 1; }
        .holiday-cell { writing-mode: vertical-rl; text-orientation: mixed; vertical-align: middle; white-space: nowrap; padding: 0; }
      </style>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
    </head>
    <body>
      <div class="WordSection1" style="font-family: Arial, sans-serif;">
        ${base64Logo ? `
        <div style="text-align: center; margin-bottom: 10px;">
          <img src="${base64Logo}" width="700" alt="KOP Sekolah" />
        </div>
        ` : ''}
        <div style="text-align: center; margin-bottom: 15px;">
          <div style="padding-top: 20px; font-weight: bold; font-size: 16px;">
            DAFTAR HADIR MURID
          </div>
          <div style="font-weight: bold; font-size: 15px; padding-bottom: 20px;">
            TAHUN AJARAN 2026/2027
          </div>
        </div>
        <table style="border: none; border-collapse: collapse; margin-bottom: 10px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; width: 300px; line-height: 1;">
          <tr>
            <td style="border: none; padding: 0; width: 60px;">Kelas</td>
            <td style="border: none; padding: 0 5px; width: 15px; text-align: center;">:</td>
            <td style="border: none; padding: 0;">${gradeText}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 0;">Bulan</td>
            <td style="border: none; padding: 0 5px; text-align: center;">:</td>
            <td style="border: none; padding: 0;">${monthName} ${year}</td>
          </tr>
        </table>
        <div style="font-size: 8px; line-height: 8px;">&nbsp;</div>
        <table border="1" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11px; text-align: center; line-height: 1;">
          <thead>
            <tr style="background-color: #8EAADB;">
              <th rowspan="2" style="padding: 2px; background-color: #8EAADB;">No.</th>
              <th rowspan="2" style="padding: 2px; text-align: left; background-color: #8EAADB;">&nbsp;&nbsp;Nama</th>
              <th colspan="${daysInMonth}" style="padding: 2px; background-color: #8EAADB;">Tanggal</th>
              <th colspan="5" style="padding: 2px; background-color: #8EAADB;">Jumlah</th>
            </tr>
            <tr style="background-color: #8EAADB;">
              ${daysHeaderHtml}
              <th style="padding: 2px; color: #FF8C00; background-color: #8EAADB;">S</th>
              <th style="padding: 2px; color: #0000FF; background-color: #8EAADB;">I</th>
              <th style="padding: 2px; color: #FF0000; background-color: #8EAADB;">A</th>
              <th style="padding: 2px; background-color: #8EAADB;">H</th>
              <th style="padding: 2px; background-color: #8EAADB;">%</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        
        <p style="margin: 0; mso-margin-top-alt: 0; mso-margin-bottom-alt: 0; font-size: 10px; line-height: 10px;">&nbsp;</p>
        <table style="width: 100%; border: none; font-family: Arial, sans-serif; font-size: 13px; text-align: center; line-height: 1.5; margin: 0; mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;">
          <tr>
            <td style="width: 35%; border: none; margin: 0; mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;">
              Mengetahui,<br/>
              Kepala UPTD SDN 2 Kalimati<br/>
              <br/><br/><br/><br/>
              <b><u>Dewi Arti Handayani, S.Pd.SD.</u></b><br/>
              NIP. 197303302007012005
            </td>
            <td style="width: 30%; border: none; margin: 0; mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;"></td>
            <td style="width: 35%; border: none; margin: 0; mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;">
              Kalimati, ${lastWorkingDate} ${monthName} ${year}<br/>
              Guru Kelas ${gradeText}<br/>
              <br/><br/><br/><br/>
              <b><u>${formatTeacherName(teacher)}</u></b><br/>
              NIP. ${formatNIP(teacher)}
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  // Create Blob and trigger download
  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Daftar_Hadir_Kelas_${grade}_${monthName}_${year}.doc`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { formatDateID } from "@/lib/format";
import type { Registrant } from "@/types/registration";

export function printRegistrantForm(registrant: Registrant) {
  const fullName = registrant.student?.fullName || "-";
  const registrationNumber = registrant.registrationNumber || "-";
  const nik = registrant.student?.nik || "-";
  const address = registrant.student?.address;
  const addressStr = address
    ? `${address.street || ""} RT/RW ${address.rt || ""}/${address.rw || ""} ${address.village || ""} ${address.district || ""} ${address.postalCode || ""}`
    : "-";
  const phone = registrant.contactPhoneNumber || "-";
  const childOrder = registrant.student?.childOrder ?? 1;
  const siblings = Number(registrant.student?.numberOfSiblings ?? 0);
  const totalChildren = siblings + 1;

  const printContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 15px; margin: 0; line-height: 1.3; }
            @page { margin: 10mm; size: 210mm 330mm; }
            .header { text-align: center; margin-bottom: 15px; margin-top: 0px; }
            .logo { width: 100%; margin: 0 0 10px 0; }
            .logo img { width: 100%; height: auto; object-fit: contain; }
            .section { margin-bottom: 10px; page-break-inside: avoid; }
            .section-title { 
              font-weight: bold; 
              font-size: 15px;
              border-bottom: 2px solid #333; 
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .field-row {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
              margin-bottom: 6px;
            }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; font-size: 13px; margin-bottom: 2px; }
            .field-value { font-size: 13px; border-bottom: 1px solid #ccc; min-height: 18px; padding-top: 2px; }
            .footer { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; }
            .signature-line { border-top: 1px solid #333; width: 100px; margin: 90px auto 0; }
            .signature-date { font-size: 10px; margin-top: 5px; }
             .header-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; font-size: 12px; }
             .header-info-right { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <img src="/cop-sekolah.png" alt="Logo Sekolah" />
            </div>
            <div style="padding-top: 20px; margin-top: 20px; font-weight: bold; font-size: 16px;">
              FORMULIR PENDAFTARAN PESERTA DIDIK BARU
            </div>
            <div style="font-weight: bold; font-size: 15px; padding-bottom: 20px;">
              TAHUN AJARAN 2026/2027
            </div>
          </div>

          <div class="section">
            <div class="section-title">DATA CALON PESERTA DIDIK</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Nama Lengkap:</div>
                <div class="field-value">${fullName}</div>
              </div>
              <div class="field">
                <div class="field-label">NIK:</div>
                <div class="field-value">${nik}</div>
              </div>
              <div class="field">
                <div class="field-label">NISN:</div>
                <div class="field-value">${registrant.student?.nisn || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Nomor Kartu Keluarga:</div>
                <div class="field-value">${registrant.student?.noKk || "-"}</div>
              </div>
              <div class="field">
                <div class="field-label">Jenis Kelamin:</div>
                <div class="field-value">${registrant.student?.gender}</div>
              </div>
              <div class="field">
                <div class="field-label">Asal TK:</div>
                <div class="field-value">${registrant.student?.kindergartenOrigin || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Tempat Lahir:</div>
                <div class="field-value">${registrant.student?.birthPlace || "-"}</div>
              </div>
              <div class="field">
                <div class="field-label">Tanggal Lahir:</div>
                <div class="field-value">${registrant.student?.birthDate ? formatDateID(String(registrant.student.birthDate).slice(0, 10)) : "-"}</div>
              </div>
              <div class="field">
                <div class="field-label">Agama:</div>
                <div class="field-value">${registrant.student?.religion || "-"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Saudara Kandung:</div>
                <div class="field-value">${
                  siblings === 0
                    ? "Anak Tunggal"
                    : `Anak ke-${childOrder} dari ${totalChildren} bersaudara`
                }</div>
              </div>
              <div class="field">
                <div class="field-label">No. HP Orang Tua:</div>
                <div class="field-value">${phone}</div>
              </div>
              <div class="field">
                <div class="field-label">Alamat Lengkap:</div>
                <div class="field-value">${addressStr}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DATA ORANG TUA</div>
            <div style="margin-bottom: 8px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">Ayah:</div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.father?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">NIK:</div>
                  <div class="field-value">${registrant.father?.nik || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Tahun Lahir:</div>
                  <div class="field-value">${registrant.father?.birthYear || "-"}</div>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Pendidikan:</div>
                  <div class="field-value">${registrant.father?.education || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Pekerjaan:</div>
                  <div class="field-value">${registrant.father?.occupation || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Penghasilan:</div>
                  <div class="field-value">${registrant.father?.monthlyIncome || "-"}</div>
                </div>
              </div>
            </div>
            <div>
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">Ibu:</div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.mother?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">NIK:</div>
                  <div class="field-value">${registrant.mother?.nik || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Tahun Lahir:</div>
                  <div class="field-value">${registrant.mother?.birthYear || "-"}</div>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Pendidikan:</div>
                  <div class="field-value">${registrant.mother?.education || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Pekerjaan:</div>
                  <div class="field-value">${registrant.mother?.occupation || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Penghasilan:</div>
                  <div class="field-value">${registrant.mother?.monthlyIncome || "-"}</div>
                </div>
              </div>
            </div>
          </div>

          ${
            registrant.hasGuardian
              ? `
          <div class="section">
            <div class="section-title">DATA WALI</div>
            <div style="margin-bottom: 8px;">
              <div class="field-row">
                <div class="field">
                  <div class="field-label">Nama:</div>
                  <div class="field-value">${registrant.guardian?.name || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">Hubungan Keluarga:</div>
                  <div class="field-value">${registrant.guardian?.relationship || "-"}</div>
                </div>
                <div class="field">
                  <div class="field-label">No. HP:</div>
                  <div class="field-value">${registrant.guardian?.phoneNumber || "-"}</div>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <div class="footer">
            <div>
              <div>Orang Tua/Wali</div>
              <div class="signature-line"></div>
            </div>
            <div></div>
            <div>
              <div>Ketua Panitia</div>
              <div style="text-decoration: underline; text-underline-offset: 2px;margin-top: 70px">Nur'anisah Fitriyanti, S.Pd.</div>
              <div style="font-weight: bold; font-size: 15px;">NIP. 198501122025212077</div>
            </div>
          </div>
        </body>
      </html>
    `;

  const printWindow = window.open("", "", "height=600,width=800");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.document.title = `${registrationNumber}-${fullName}`;
    printWindow.print();
  }
}

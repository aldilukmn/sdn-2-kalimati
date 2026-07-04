"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/app/components/form/InputField";
import SelectField from "@/app/components/form/SelectField";
import DatePickerField from "@/app/components/DatePickerField";
import { GENDER_OPTIONS, RELIGION_OPTIONS } from "@/app/data/form-options";

interface StudentDataStepProps {
  formData: RegistrationForm;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

export default function StudentDataStep({
  formData,
  onChange,
}: StudentDataStepProps) {
  return (
    <Card className="dark:bg-gray-800 px-7 py-6 md:px-10 md:py-8">
      <CardTitle className="text-lg md:text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-200 text-gray-800 dark:text-gray-200">
        Data Calon Peserta Didik
      </CardTitle>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nama Lengkap"
            name="student.fullName"
            required
            placeholder="Masukkan Nama Lengkap"
            value={formData.student.fullName}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="NISN (Jika Ada)"
            name="student.nisn"
            placeholder="Nomor Induk Siswa Nasional"
            value={formData.student.nisn}
            onChange={onChange}
            numericOnly
            maxLength={10}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="NIK (Nomor Induk Kependudukan)"
            name="student.nik"
            required
            placeholder="Nomor NIK (16 digit)"
            value={formData.student.nik}
            onChange={onChange}
            maxLength={16}
            numericOnly
          />
          <InputField
            label="KK (Nomor Kartu Keluarga)"
            name="student.noKk"
            required
            placeholder="Nomor KK (16 digit)"
            value={formData.student.noKk}
            onChange={onChange}
            maxLength={16}
            numericOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Tempat Lahir"
            name="student.birthPlace"
            required
            placeholder="Nama Kabupaten/Kota"
            value={formData.student.birthPlace}
            onChange={onChange}
            nameOnly
          />
          <DatePickerField
            label="Tanggal Lahir"
            name="student.birthDate"
            required
            value={formData.student.birthDate}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Jenis Kelamin"
            name="student.gender"
            required
            options={GENDER_OPTIONS}
            value={formData.student.gender}
            onChange={onChange}
          />
          <SelectField
            label="Agama"
            name="student.religion"
            required
            options={RELIGION_OPTIONS}
            value={formData.student.religion}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Jalan"
            name="student.address.street"
            placeholder="Nama jalan dan nomor rumah"
            value={formData.student.address.street}
            onChange={onChange}
            required
          />
          <InputField
            label="RT"
            name="student.address.rt"
            placeholder="001, 002, dst"
            value={formData.student.address.rt}
            onChange={onChange}
            required
            maxLength={3}
            numericOnly
          />
          <InputField
            label="RW"
            name="student.address.rw"
            placeholder="001, 002, dst"
            value={formData.student.address.rw}
            onChange={onChange}
            required
            maxLength={3}
            numericOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Desa/Kelurahan"
            name="student.address.village"
            placeholder="Nama Desa"
            required
            value={formData.student.address.village}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Kecamatan"
            name="student.address.district"
            placeholder="Nama Kecamatan"
            required
            value={formData.student.address.district}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Kode Pos"
            name="student.address.postalCode"
            required
            placeholder="Kode Pos"
            value={formData.student.address.postalCode}
            onChange={onChange}
            maxLength={5}
            numericOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Anak Ke-"
            name="student.childOrder"
            required
            placeholder="1, 2, 3, dst"
            value={formData.student.childOrder}
            onChange={onChange}
            numericOnly
            maxLength={1}
          />
          <InputField
            label="Jumlah Saudara Kandung"
            name="student.numberOfSiblings"
            required
            placeholder="1, 2, 3, dst (isi 0 jika tidak ada)"
            value={formData.student.numberOfSiblings}
            onChange={onChange}
            numericOnly
            maxLength={1}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nomor HP Orang Tua"
            name="contactPhoneNumber"
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            value={formData.contactPhoneNumber}
            onChange={onChange}
            maxLength={15}
            numericOnly
          />
          <InputField
            label="Asal TK/RA"
            name="student.kindergartenOrigin"
            placeholder="Nama TK/RA atau Tidak Sekolah TK/RA"
            value={formData.student.kindergartenOrigin}
            onChange={onChange}
          />
        </div>
      </div>
    </Card>
  );
}

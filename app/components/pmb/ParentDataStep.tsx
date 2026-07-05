"use client";

import { Card, CardTitle } from "@/components/ui/card";
import InputField from "@/app/components/form/InputField";
import SelectField from "@/app/components/form/SelectField";
import {
  OCCUPATION_OPTIONS,
  EDUCATION_OPTIONS,
  INCOME_OPTIONS,
} from "@/app/data/form-options";
import type { RegistrationForm } from "@/types/registration";

interface ParentDataStepProps {
  formData: RegistrationForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function ParentDataStep({ formData, onChange }: ParentDataStepProps) {
  return (
    <Card className="dark:bg-gray-800 px-7 py-6 md:px-10 md:py-8">
      <div>
        <CardTitle className="text-lg md:text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-200 text-gray-800 dark:text-gray-200">
          Data Ayah
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Nama Ayah"
            name="father.name"
            required
            placeholder="Nama lengkap ayah"
            value={formData.father.name}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Tahun Lahir Ayah"
            name="father.birthYear"
            required
            placeholder="Contoh: 1960"
            value={formData.father.birthYear}
            onChange={onChange}
            numericOnly
            maxLength={4}
          />
          <SelectField
            label="Pekerjaan Ayah"
            name="father.occupation"
            required
            options={OCCUPATION_OPTIONS}
            value={formData.father.occupation}
            onChange={onChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField
            label="NIK Ayah"
            name="father.nik"
            required
            placeholder="Nomor NIK (16 digit)"
            value={formData.father.nik}
            onChange={onChange}
            maxLength={16}
            numericOnly
          />
          <SelectField
            label="Pendidikan Terakhir Ayah"
            name="father.education"
            required
            options={EDUCATION_OPTIONS}
            value={formData.father.education}
            onChange={onChange}
          />
          <SelectField
            label="Penghasilan Perbulan Ayah"
            name="father.monthlyIncome"
            required
            options={INCOME_OPTIONS}
            value={formData.father.monthlyIncome}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="mt-10">
        <CardTitle className="text-lg md:text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-200 text-gray-800 dark:text-gray-200">
          Data Ibu
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Nama Ibu"
            name="mother.name"
            required
            placeholder="Nama lengkap ibu"
            value={formData.mother.name}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Tahun Lahir Ibu"
            name="mother.birthYear"
            required
            placeholder="Contoh: 1965"
            value={formData.mother.birthYear}
            onChange={onChange}
            numericOnly
            maxLength={4}
          />
          <SelectField
            label="Pekerjaan Ibu"
            name="mother.occupation"
            required
            options={OCCUPATION_OPTIONS}
            value={formData.mother.occupation}
            onChange={onChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField
            label="NIK Ibu"
            name="mother.nik"
            required
            placeholder="Nomor NIK (16 digit)"
            value={formData.mother.nik}
            onChange={onChange}
            maxLength={16}
            numericOnly
          />
          <SelectField
            label="Pendidikan Terakhir Ibu"
            name="mother.education"
            required
            options={EDUCATION_OPTIONS}
            value={formData.mother.education}
            onChange={onChange}
          />
          <SelectField
            label="Penghasilan Perbulan Ibu"
            name="mother.monthlyIncome"
            required
            options={INCOME_OPTIONS}
            value={formData.mother.monthlyIncome}
            onChange={onChange}
          />
        </div>
      </div>
    </Card>
  );
}

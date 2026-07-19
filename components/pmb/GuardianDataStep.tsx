"use client";

import { Card, CardTitle } from "@/components/ui/card";
import InputField from "@/components/form/InputField";
import type { RegistrationForm } from "@/types/registration";

interface GuardianDataStepProps {
  formData: RegistrationForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function GuardianDataStep({
  formData,
  onChange,
}: GuardianDataStepProps) {
  return (
    <Card className="dark:bg-gray-800 px-7 py-6 md:px-10 md:py-8">
      <CardTitle className="text-lg md:text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-200 text-gray-800 dark:text-gray-200">
        Data Wali (Jika Ada)
      </CardTitle>

      <div className="mb-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="hasGuardian"
            checked={formData.hasGuardian}
            onChange={onChange}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Saya memiliki wali (jika tidak ada, abaikan bagian ini)
          </span>
        </label>
      </div>

      {formData.hasGuardian && (
        <div className="space-y-6 p-6 rounded-lg">
          <InputField
            label="Nama Wali"
            name="guardian.name"
            placeholder="Nama lengkap wali"
            value={formData.guardian.name}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Hubungan dengan Anak"
            name="guardian.relationship"
            placeholder="Contoh: Kakek, Nenek, Paman, Bibi, dll"
            value={formData.guardian.relationship}
            onChange={onChange}
            nameOnly
          />
          <InputField
            label="Nomor HP Wali"
            name="guardian.phoneNumber"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={formData.guardian.phoneNumber}
            onChange={onChange}
            numericOnly
            maxLength={15}
          />
        </div>
      )}
    </Card>
  );
}

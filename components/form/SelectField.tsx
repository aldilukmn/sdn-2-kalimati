"use client";

import React, { memo } from "react";

export interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = memo(
  ({
    label,
    name,
    options,
    required = false,
    value,
    onChange,
  }: SelectFieldProps) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
      >
        <option value="" disabled className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          -- Pilih --
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-gray-100 dark:bg-gray-700"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  ),
);

SelectField.displayName = "SelectField";

export default SelectField;

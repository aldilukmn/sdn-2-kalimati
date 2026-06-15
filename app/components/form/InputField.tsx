"use client";

import React, { memo } from "react";

export interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  numericOnly?: boolean;
  nameOnly?: boolean;
}

const InputField = memo(
  ({
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
    value,
    onChange,
    maxLength,
    numericOnly = false,
    nameOnly = false,
  }: InputFieldProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (numericOnly) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      } else if (nameOnly) {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s\-']/g, "");
      }
      onChange(e);
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={numericOnly ? "text" : type}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={numericOnly ? "numeric" : undefined}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
        />
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;

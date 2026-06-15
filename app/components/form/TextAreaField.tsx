"use client";

import React, { memo } from "react";

export interface TextAreaFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = memo(
  ({
    label,
    name,
    required = false,
    placeholder = "",
    value,
    onChange,
  }: TextAreaFieldProps) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition resize-none"
      />
    </div>
  ),
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;

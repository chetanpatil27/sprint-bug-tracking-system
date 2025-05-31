import React, { FC } from "react";
import Label from "../Label";
import FieldMessages from "../field-messages";
import { Controller, Control, FieldValues } from "react-hook-form";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: string | boolean | null; // Can be a string for custom success message or boolean
  error?: string | boolean | object | null; // Can be a string for custom error message or boolean
  label?: string | null; // Optional label text
  control?: Control<FieldValues> | undefined; // React Hook Form control object for controlled components
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = null,
  error = null,
  label = "", control
}) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  const renderComp = ({ field }: { field: { name?: string; value?: string | number; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur?: () => void; } }) => {
    return (<input
      type={type}
      id={id}
      placeholder={placeholder}
      // defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={inputClasses}
      {...field}
    />)
  }

  return (
    <div className="relative">
      {label && <Label htmlFor={id}>{label}</Label>}
      {control && name ? (
        <Controller
          control={control}
          render={renderComp}
          defaultValue={""}
          name={name ?? ""}
        />) : (renderComp({ field: { name, onChange, value: value ?? "" } }))}
      <FieldMessages error={error} success={success} name={name} />
    </div>
  );
};

export default Input;

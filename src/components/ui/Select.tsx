import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  hint,
  options,
  id,
  disabled = false,
  className,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-900 mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        disabled={disabled}
        className={clsx(
          'w-full px-3 py-2 border border-neutral-200 rounded-lg',
          'text-neutral-900 bg-white',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-rose-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className,
  disabled = false,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-900 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        disabled={disabled}
        className={clsx(
          'w-full px-3 py-2 border border-neutral-200 rounded-lg',
          'text-neutral-900 placeholder-neutral-500',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-rose-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

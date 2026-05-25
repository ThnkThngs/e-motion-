import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'indigo' | 'amber' | 'rose' | 'teal' | 'success';
}

const variantClasses = {
  default: 'bg-neutral-100 text-neutral-900',
  indigo: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-500',
  teal: 'bg-teal-100 text-teal-600',
  success: 'bg-green-100 text-green-700',
};

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

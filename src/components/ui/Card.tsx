import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
}

export function Card({
  elevated = false,
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-neutral-100 rounded-lg',
        elevated && 'shadow-md',
        interactive && 'transition-all duration-150 hover:shadow-lg hover:scale-105 cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

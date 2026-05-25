import React from 'react';
import clsx from 'clsx';

export interface CardTemplateProps {
  coupleName: string;
  groomName?: string;
  brideName?: string;
  eventDate: string;
  akadDate?: string;
  resepsiDate?: string;
  venue?: string;
  greetingMessage?: string;
  accentColor?: 'indigo' | 'amber' | 'rose' | 'teal';
  backgroundImage?: string;
}

const accentColorClasses = {
  indigo: {
    bg: 'bg-indigo-700',
    text: 'text-indigo-700',
    light: 'bg-indigo-50',
    border: 'border-indigo-700',
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    light: 'bg-amber-50',
    border: 'border-amber-600',
  },
  rose: {
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    light: 'bg-rose-50',
    border: 'border-rose-500',
  },
  teal: {
    bg: 'bg-teal-600',
    text: 'text-teal-600',
    light: 'bg-teal-50',
    border: 'border-teal-600',
  },
};

export function CardTemplate({
  coupleName,
  akadDate,
  resepsiDate,
  venue,
  greetingMessage,
  accentColor = 'indigo',
  backgroundImage,
}: CardTemplateProps) {
  const colors = accentColorClasses[accentColor];

  return (
    <div
      className={clsx(
        'relative w-full h-full overflow-hidden',
        'bg-gradient-to-br from-neutral-50 to-neutral-100',
        'flex flex-col justify-between p-8'
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Overlay for background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header with accent line */}
        <div>
          <div className={clsx('w-12 h-1 rounded-full mb-6', colors.bg)} />
          <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-2">
            {coupleName}
          </h1>
          <p className="text-sm text-neutral-600 uppercase tracking-wider">
            Wedding Invitation
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-4 my-8">
          {greetingMessage && (
            <p className="text-lg text-neutral-700 italic">{greetingMessage}</p>
          )}

          {(akadDate || resepsiDate) && (
            <div className="space-y-3">
              {akadDate && (
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Akad Nikah
                  </p>
                  <p className="text-base font-semibold text-neutral-900">
                    {akadDate}
                  </p>
                </div>
              )}
              {resepsiDate && (
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    Resepsi Pernikahan
                  </p>
                  <p className="text-base font-semibold text-neutral-900">
                    {resepsiDate}
                  </p>
                </div>
              )}
            </div>
          )}

          {venue && (
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                Venue
              </p>
              <p className="text-base text-neutral-900">{venue}</p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className={clsx('text-center py-4 rounded-lg', colors.bg)}>
          <p className="text-white font-medium text-lg">
            We invite you to celebrate
          </p>
        </div>
      </div>
    </div>
  );
}

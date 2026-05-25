import React from 'react';
import clsx from 'clsx';
import { CardTemplate, CardTemplateProps } from './CardTemplate';

export function SongketTemplate(props: CardTemplateProps) {
  return (
    <div
      className={clsx(
        'relative w-full h-full aspect-video',
        'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
        'border-8 border-amber-900/20'
      )}
      style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(180, 83, 9, 0.03) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(180, 83, 9, 0.03) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(180, 83, 9, 0.03) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(180, 83, 9, 0.03) 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
      }}
    >
      <CardTemplate {...props} accentColor="amber" />

      {/* Decorative gold corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/40" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/40" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/40" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/40" />
    </div>
  );
}

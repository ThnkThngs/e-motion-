import React from 'react';
import clsx from 'clsx';
import { CardTemplate, CardTemplateProps } from './CardTemplate';

export function MinimalistTemplate(props: CardTemplateProps) {
  return (
    <div
      className={clsx(
        'relative w-full h-full aspect-video',
        'bg-white'
      )}
    >
      {/* Geometric kerawang pattern - subtle background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, #3730A3 49%, #3730A3 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, #3730A3 49%, #3730A3 51%, transparent 52%)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0',
        }}
      />

      <CardTemplate {...props} accentColor="indigo" />

      {/* Geometric frame */}
      <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-indigo-700/20 pointer-events-none" />

      {/* Small geometric accents */}
      <div className="absolute top-10 left-10 w-4 h-4 border-2 border-indigo-700/30" />
      <div className="absolute top-10 right-10 w-4 h-4 border-2 border-indigo-700/30" />
      <div className="absolute bottom-10 left-10 w-4 h-4 border-2 border-indigo-700/30" />
      <div className="absolute bottom-10 right-10 w-4 h-4 border-2 border-indigo-700/30" />
    </div>
  );
}

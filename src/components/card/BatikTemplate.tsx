import React from 'react';
import clsx from 'clsx';
import { CardTemplate, CardTemplateProps } from './CardTemplate';

export function BatikTemplate(props: CardTemplateProps) {
  return (
    <div
      className={clsx(
        'relative w-full h-full aspect-video',
        'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
      )}
    >
      {/* Batik border pattern - decorative top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-amber-900/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-900/10 to-transparent" />

      {/* Side accent lines */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/30 via-amber-600/20 to-transparent" />
      <div className="absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/30 via-amber-600/20 to-transparent" />

      <CardTemplate {...props} accentColor="amber" />

      {/* Decorative batik corner motifs */}
      <div className="absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-amber-600/30" />
      <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-amber-600/20" />

      <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-amber-600/30" />
      <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-amber-600/20" />

      <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full border-2 border-amber-600/30" />
      <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-amber-600/20" />

      <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border-2 border-amber-600/30" />
      <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-amber-600/20" />
    </div>
  );
}

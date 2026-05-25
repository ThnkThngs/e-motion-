import React from 'react';
import clsx from 'clsx';
import { CardTemplate, CardTemplateProps } from './CardTemplate';

export function FloralTemplate(props: CardTemplateProps) {
  return (
    <div
      className={clsx(
        'relative w-full h-full aspect-video',
        'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50'
      )}
    >
      {/* Floral accent bars */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

      <CardTemplate {...props} accentColor="rose" />

      {/* Decorative petals (bunga raya style) */}
      <div className="absolute top-8 left-8">
        <div className="relative w-8 h-8">
          {[0, 72, 144, 216, 288].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-4 bg-rose-300/40 rounded-full origin-bottom"
              style={{
                bottom: '50%',
                left: '50%',
                transform: `translateX(-50%) rotate(${angle}deg) translateY(-8px)`,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-rose-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <div className="relative w-8 h-8">
          {[0, 72, 144, 216, 288].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-4 bg-rose-300/40 rounded-full origin-bottom"
              style={{
                bottom: '50%',
                left: '50%',
                transform: `translateX(-50%) rotate(${angle}deg) translateY(-8px)`,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-rose-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

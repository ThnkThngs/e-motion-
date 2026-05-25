'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { createCardEntranceAnimation } from '@/lib/animations';

interface CardPreviewProps {
  templateId: string;
  coupleName?: string;
  eventDate?: string;
  accentColor?: string;
}

export function CardPreview({
  templateId,
  coupleName = 'Your Names',
  eventDate = 'Your Event Date',
  accentColor = 'indigo',
}: CardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createCardEntranceAnimation(containerRef.current, 0.4);
  }, [templateId]);

  const accentColorMap: Record<string, string> = {
    indigo: 'bg-indigo-700 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-500 text-white',
    teal: 'bg-teal-600 text-white',
  };

  return (
    <div ref={containerRef} className="h-full flex items-center justify-center">
      <Card elevated className="w-full max-w-sm aspect-video overflow-hidden">
        <div className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-neutral-50 to-neutral-100">
          {/* Card Header */}
          <div>
            <div
              className={`w-12 h-1 rounded-full mb-6 ${accentColorMap[accentColor]
                .split(' ')[0]}`}
            />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {coupleName}
            </h2>
            <p className="text-sm text-neutral-600">Wedding Invitation</p>
          </div>

          {/* Card Body */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Event Date
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                {eventDate}
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div
            className={`text-center py-3 rounded-lg ${
              accentColorMap[accentColor]
            }`}
          >
            <p className="text-sm font-medium">We invite you</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

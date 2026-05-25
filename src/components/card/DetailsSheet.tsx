'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { CardData } from '@/types/card';
import { Button } from '@/components/ui/Button';

interface DetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CardData;
}

export function DetailsSheet({
  isOpen,
  onClose,
  cardData,
}: DetailsSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    cardData.venueAddress
  )}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `You are invited to the wedding of ${cardData.coupleName}! Check out the invitation: https://e-motion.my/cards/${cardData.shareToken}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={clsx(
          'absolute inset-0 bg-black transition-opacity duration-200',
          isOpen ? 'opacity-40' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={clsx(
          'absolute bottom-0 left-0 right-0',
          'bg-white rounded-t-2xl shadow-lg',
          'max-h-80 overflow-y-auto',
          'transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Event Details
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close details"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Akad Nikah Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Akad Nikah
            </h3>
            <p className="text-base font-semibold text-neutral-900 mb-1">
              {cardData.akadDate}
            </p>
            <p className="text-sm text-neutral-600">{cardData.akadTime}</p>
          </div>

          {/* Resepsi Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Resepsi Pernikahan
            </h3>
            <p className="text-base font-semibold text-neutral-900 mb-1">
              {cardData.resepsiDate}
            </p>
            <p className="text-sm text-neutral-600">{cardData.resepsiTime}</p>
          </div>

          {/* Venue Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Venue
            </h3>
            <p className="text-base font-semibold text-neutral-900 mb-1">
              {cardData.venue}
            </p>
            <p className="text-sm text-neutral-600">
              {cardData.venueAddress}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Get Directions
              </Button>
            </a>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
              >
                Share on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

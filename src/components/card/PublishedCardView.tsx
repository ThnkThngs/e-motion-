'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { CardData } from '@/types/card';
import { createCardEntranceAnimation } from '@/lib/animations';
import { CardTemplate } from '@/components/card/CardTemplate';
import { ActionBar } from '@/components/card/ActionBar';
import { RSVPModal } from '@/components/card/RSVPModal';
import { WishModal } from '@/components/card/WishModal';
import { DetailsSheet } from '@/components/card/DetailsSheet';

interface PublishedCardViewProps {
  cardData: CardData;
}

export function PublishedCardView({ cardData }: PublishedCardViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      createCardEntranceAnimation(cardRef.current);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-neutral-900">
      {/* Card Display Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div
          ref={cardRef}
          className={clsx(
            'w-full max-w-2xl aspect-video rounded-2xl overflow-hidden',
            'shadow-2xl bg-white'
          )}
        >
          <CardTemplate
            coupleName={cardData.coupleName}
            groomName={cardData.groom}
            brideName={cardData.bride}
            eventDate={cardData.resepsiDate}
            akadDate={cardData.akadDate}
            resepsiDate={cardData.resepsiDate}
            venue={cardData.venue}
            greetingMessage={cardData.greetingMessage}
            accentColor={cardData.accentColor}
          />
        </div>
      </div>

      {/* Action Bar - Fixed at bottom */}
      <ActionBar
        onRsvpClick={() => setShowRsvpModal(true)}
        onWishClick={() => setShowWishModal(true)}
        onDetailsClick={() => setIsDetailsSheetOpen(true)}
      />

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        onSubmit={(data) => {
          console.log('RSVP submitted:', data);
          setShowRsvpModal(false);
        }}
        cardToken={cardData.shareToken}
      />

      {/* Wish Modal */}
      <WishModal
        isOpen={showWishModal}
        onClose={() => setShowWishModal(false)}
        onSubmit={(data) => {
          console.log('Wish submitted:', data);
          setShowWishModal(false);
        }}
        cardToken={cardData.shareToken}
      />

      {/* Details Sheet */}
      <DetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => setIsDetailsSheetOpen(false)}
        cardData={cardData}
      />
    </div>
  );
}

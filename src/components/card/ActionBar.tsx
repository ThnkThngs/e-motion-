'use client';

import React from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';

interface ActionBarProps {
  onRsvpClick: () => void;
  onWishClick: () => void;
  onDetailsClick: () => void;
}

export function ActionBar({
  onRsvpClick,
  onWishClick,
  onDetailsClick,
}: ActionBarProps) {
  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40',
        'px-4 py-6 md:py-8 pb-8 md:pb-8',
        'bg-gradient-to-t from-black/50 to-transparent',
        'md:bg-black/10 md:backdrop-blur-sm',
        'flex justify-center items-center gap-3 md:gap-4'
      )}
    >
      <Button
        variant="primary"
        size="lg"
        onClick={onRsvpClick}
        className="flex-1 max-w-xs"
      >
        RSVP
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onWishClick}
        className="flex-1 max-w-xs"
      >
        Write Wish
      </Button>

      {/* Gift button hidden on mobile */}
      <Button
        variant="tertiary"
        size="lg"
        onClick={onDetailsClick}
        className="hidden md:flex flex-1 max-w-xs"
        disabled
      >
        Gift
      </Button>

      {/* Details button visible on mobile */}
      <Button
        variant="tertiary"
        size="lg"
        onClick={onDetailsClick}
        className="md:hidden flex-1 max-w-xs"
      >
        Details
      </Button>
    </div>
  );
}

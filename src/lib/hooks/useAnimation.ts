'use client';

import { useEffect, useRef } from 'react';
import {
  createCardEntranceAnimation,
  createTemplateHoverAnimation,
  createButtonPressAnimation,
  createScrollRevealAnimation,
  createInputFocusAnimation,
  createErrorShakeAnimation,
  createSuccessAnimation,
} from '../animations';

// Hook for card entrance animation
export function useCardEntrance(dependency?: unknown, duration: number = 0.4) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createCardEntranceAnimation(ref.current, duration);
  }, [duration, dependency]);

  return ref;
}

// Hook for template hover animation
export function useTemplateHover() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    createTemplateHoverAnimation(ref.current);
  }, []);

  return ref;
}

// Hook for button press animation
export function useButtonPress() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    createButtonPressAnimation(ref.current);
  }, []);

  return ref;
}

// Hook for scroll reveal animation (selector-based)
export function useScrollReveal() {
  useEffect(() => {
    createScrollRevealAnimation('[data-scroll-reveal]');
  }, []);
}

// Hook for input focus animation
export function useInputFocus() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    createInputFocusAnimation(ref.current);
  }, []);

  return ref;
}

// Hook for error shake animation
export function useErrorShake(shouldShake?: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldShake) {
      createErrorShakeAnimation(ref.current);
    }
  }, [shouldShake]);

  return ref;
}

// Hook for success animation
export function useSuccessAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSuccessAnimation(ref.current);
  }, []);

  return ref;
}

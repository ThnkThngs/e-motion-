import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Card entrance animation: fade + subtle scale
export function createCardEntranceAnimation(
  element: HTMLElement | null,
  duration: number = 0.4
) {
  if (!element) return;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, scale: 1 });
    return;
  }

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration, ease: 'power2.out' }
  );
}

// Template card hover animation: elevation + subtle lift
export function createTemplateHoverAnimation(
  element: HTMLElement | null
) {
  if (!element || prefersReducedMotion()) return;

  const defaultShadow = '0 1px 3px rgba(0,0,0,0.08)';
  const hoverShadow = '0 4px 12px rgba(0,0,0,0.1)';

  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      boxShadow: hoverShadow,
      y: -2,
      duration: 0.2,
      ease: 'power1.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      boxShadow: defaultShadow,
      y: 0,
      duration: 0.2,
      ease: 'power1.out',
    });
  });
}

// Button press animation: scale feedback
export function createButtonPressAnimation(
  element: HTMLElement | null
) {
  if (!element || prefersReducedMotion()) return;

  element.addEventListener('mousedown', () => {
    gsap.to(element, { scale: 0.98, duration: 0.1 });
  });

  element.addEventListener('mouseup', () => {
    gsap.to(element, { scale: 1, duration: 0.1 });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration: 0.1 });
  });
}

// Scroll reveal animation: fade in + slide up
export function createScrollRevealAnimation(
  selector: string,
  staggerDelay: number = 0.05
) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, y: 0 });
    return;
  }

  gsap.utils.toArray<HTMLElement>(selector).forEach((element, index) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
        delay: index * staggerDelay,
      }
    );
  });
}

// Template animation preview: loop entrance sequence
export function createTemplatePreviewAnimation(element: HTMLElement | null) {
  if (!element) return;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

  tl.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out' }
  ).to(element, { opacity: 1, duration: 2 }).to(
    element,
    { opacity: 0, duration: 0.3, ease: 'power2.in' }
  );

  return tl;
}

// Modal enter animation: backdrop fade + content slide up
export function createModalAnimation(
  backdrop: HTMLElement | null,
  content: HTMLElement | null
) {
  if (!backdrop || !content) return;

  if (prefersReducedMotion()) {
    gsap.set([backdrop, content], { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(
    content,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.1 }
  );
}

// Modal exit animation
export function createModalExitAnimation(
  backdrop: HTMLElement | null,
  content: HTMLElement | null,
  onComplete?: () => void
) {
  if (!backdrop || !content) {
    onComplete?.();
    return;
  }

  if (prefersReducedMotion()) {
    onComplete?.();
    return;
  }

  const tl = gsap.timeline({ onComplete });

  tl.to(content, { opacity: 0, y: 12, duration: 0.2, ease: 'power2.in' }, 0)
    .to(backdrop, { opacity: 0, duration: 0.2 }, 0);
}

// Input field animation: focus indicator
export function createInputFocusAnimation(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return;

  element.addEventListener('focus', () => {
    gsap.to(element, {
      borderColor: 'rgb(55, 48, 163)',
      duration: 0.15,
    });
  });

  element.addEventListener('blur', () => {
    gsap.to(element, {
      borderColor: 'rgb(229, 229, 229)',
      duration: 0.15,
    });
  });
}

// Form error shake animation
export function createErrorShakeAnimation(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return;

  gsap.fromTo(
    element,
    { x: -4 },
    {
      x: 4,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
    }
  );
}

// Success checkmark animation: scale + fade
export function createSuccessAnimation(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, scale: 1 });
    return;
  }

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out' }
  );
}

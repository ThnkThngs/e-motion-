"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const useScrollReveal = <T extends HTMLElement = HTMLElement>(opts?: {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  scale?: number;
  stagger?: number;
  childSelector?: string;
}) => {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const target = opts?.childSelector
        ? ref.current.querySelectorAll(opts.childSelector)
        : ref.current;
      gsap.from(target, {
        scrollTrigger: {
          trigger: ref.current,
          start: opts?.start ?? "top 80%",
          toggleActions: "play none none reverse",
        },
        y: opts?.y ?? 60,
        opacity: 0,
        scale: opts?.scale ?? 1,
        duration: opts?.duration ?? 0.9,
        delay: opts?.delay ?? 0,
        stagger: opts?.stagger,
        ease: "power2.out",
      });
    },
    { scope: ref },
  );

  return ref;
};

"use client";

import { useEffect } from "react";

// Mirrors the vanilla IntersectionObserver in the reference HTML:
//   const observer=new IntersectionObserver(entries=>{ entries.forEach(e=>{
//     if(e.isIntersecting) e.target.classList.add('visible');
//   })}, {threshold:0.08});
//   document.querySelectorAll('.reveal-3d').forEach(r=>observer.observe(r));
//
// We register a single page-level observer and let warisan.css drive the
// transition via .reveal-3d / .reveal-3d.visible class swap.
export const useReveal3d = () => {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    const nodes = document.querySelectorAll<HTMLElement>(".reveal-3d");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
};

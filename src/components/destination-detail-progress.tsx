"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function DestinationDetailProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    };
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
  }, []);
  return <div className="profile-reading-progress" aria-hidden="true"><div ref={bar} style={{ transition: reduced ? "none" : undefined }} /></div>;
}

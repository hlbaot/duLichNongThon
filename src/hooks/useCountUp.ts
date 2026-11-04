"use client";
import type { CountUpOptions } from "@/types/count-up";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
export function useCountUp(target: number, { duration = 1600, start }: CountUpOptions) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    if (reducedMotion) { current.current = target; return; }
    if (!start) return;
    const from = current.current;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / Math.max(1, duration));
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const next = Math.round(from + (target - from) * eased);
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start, reducedMotion]);
  return reducedMotion ? target : value;
}

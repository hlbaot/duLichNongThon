"use client";
import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/time";
export function useCountdown(targetTimestamp: number): { h: string; m: string; s: string } {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const initial = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, []);
  return now === null || !targetTimestamp ? { h: "00", m: "00", s: "00" } : getCountdownParts(targetTimestamp, now);
}

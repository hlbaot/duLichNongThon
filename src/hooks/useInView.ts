"use client";
import type { InViewOptions } from "@/types/in-view";
import { useEffect, useRef, useState } from "react";
export function useInView<T extends HTMLElement = HTMLDivElement>({ threshold = .35, once = true }: InViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); if (once) observer.unobserve(element); }
      else if (!once) setInView(false);
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

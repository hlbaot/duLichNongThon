"use client";
import type { RevealProps } from "@/types/reveal-on-scroll";
export function RevealOnScroll({ children, className = "", delay = 0, direction = "up" }: RevealProps) {
  return <div data-aos={direction === "fade" ? "fade" : `fade-${direction}`} data-aos-delay={delay} className={className}>{children}</div>;
}

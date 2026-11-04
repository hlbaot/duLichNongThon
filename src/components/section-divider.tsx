import type { SectionDividerProps } from "@/types/section-divider";
import type { CSSProperties } from "react";
export function SectionDivider({ fill, className = "" }: SectionDividerProps) {
  return (
    <div className={`section-divider ${className}`} style={{ color: fill } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-full block">
        <path className="section-divider-fill"
          d="M0,28 C320,64 640,12 960,48 C1200,66 1340,42 1440,24 L1440,72 L0,72 Z"
          fill="currentColor"
        />
        <path className="section-divider-ripple" d="M0,28 C320,64 640,12 960,48 C1200,66 1340,42 1440,24" fill="none" />
      </svg>
    </div>
  );
}

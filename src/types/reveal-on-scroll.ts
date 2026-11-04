import type { ReactNode } from "react";

export interface RevealProps { children: ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "fade"; }

"use client";

import type { CSSProperties } from "react";
import { STEPS } from "./steps";
import { StepCard } from "./step-card";

export function StepTimeline() {
  return (
    <ol className="how-timeline" role="list">
      {STEPS.map((step, index) => (
        <StepCard key={step.step} {...step} style={{ "--step-delay": `${index * 120}ms` } as CSSProperties} />
      ))}
    </ol>
  );
}

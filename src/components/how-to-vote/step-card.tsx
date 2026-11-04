"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VotingStep } from "@/types/how-to-vote";

export function StepCard({ step, title, desc, note, highlight, style }: VotingStep & { style: CSSProperties }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const count = useCountUp(step, { start: inView, duration: 750 });
  const number = String(count).padStart(2, "0");

  function moveSpotlight(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    const surface = event.currentTarget.style;
    surface.setProperty("--spot-x", `${x * 100}%`);
    surface.setProperty("--spot-y", `${y * 100}%`);
    surface.setProperty("--tilt-x", `${(0.5 - y) * 12}deg`);
    surface.setProperty("--tilt-y", `${(x - 0.5) * 12}deg`);
    surface.setProperty("--watermark-x", `${(x - 0.5) * 20}px`);
    surface.setProperty("--watermark-y", `${(y - 0.5) * 20}px`);
  }

  return (
    <li
      ref={ref}
      style={style}
      className="how-step"
      data-visible={inView}
      data-highlight={highlight}
      data-aos="fade-up"
      data-aos-delay={(step - 1) * 150}
      data-aos-duration="800"
      data-aos-offset="20"
    >
      <span className="how-node" aria-hidden="true">{number}</span>
      <div className="how-step-entry">
        <div className="how-tilt-zone" onPointerMove={moveSpotlight}>
          <article className="how-card">
            {highlight && <span className="how-rotating-border" aria-hidden="true" />}
            <span className="how-shimmer" aria-hidden="true" />
            <span className="how-watermark" aria-hidden="true">{number}</span>
            <div className="how-card-content">
              <div className="how-card-top">
                <div className="how-card-labels">
                  <span className="how-step-pill">Bước {step}</span>
                  {highlight && <span className="how-important">Quan trọng</span>}
                </div>
              </div>
              <h3>{title}</h3>
              <p className="how-description">{desc}</p>
              <p className="how-note"><span />{note}</p>
              {highlight && (
                <a href="#destinations" className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-bold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                  Chọn điểm đến
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </li>
  );
}

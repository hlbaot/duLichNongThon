"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function DestinationDetailCarousel({ children, label }: { children: ReactNode; label: string }) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  if (!items.length) return null;
  return <div className="profile-carousel" role="region" aria-label={label}>
    <div className="profile-carousel-track" ref={track} onScroll={() => {
      const element = track.current;
      if (!element) return;
      const positions = [...element.children].map(child => Math.abs((child as HTMLElement).offsetLeft - element.scrollLeft));
      setActive(positions.indexOf(Math.min(...positions)));
    }}>{items.map((item, index) => <div className="profile-carousel-slide" key={index}>{item}</div>)}</div>
    {items.length > 1 && <div className="profile-carousel-dots" aria-label="Chọn thẻ thông tin">
      {items.map((_, index) => <button type="button" key={index} aria-label={`Thẻ ${index + 1} / ${items.length}`} aria-current={index === active ? "true" : undefined} onClick={() => {
        const element = track.current;
        const slide = element?.children[index] as HTMLElement | undefined;
        if (element && slide) element.scrollTo({ left: slide.offsetLeft, behavior: reduced ? "instant" : "smooth" });
      }} />)}
    </div>}
  </div>;
}

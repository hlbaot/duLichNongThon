"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";

function ScrollDownButton() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const fadeDistance = 180;
      const nextOpacity = Math.max(0, Math.min(1, 1 - y / fadeDistance));
      setOpacity(nextOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById("hero");
        if (el) {
          if (typeof window !== "undefined" && window.__lenis) {
            window.__lenis.scrollTo(el, { offset: 0 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }}
      aria-label="Cuộn xuống nội dung chính"
      style={{
        opacity,
        transform: `translate(-50%, ${(1 - opacity) * 12}px) scale(${0.92 + opacity * 0.08})`,
        pointerEvents: opacity > 0.05 ? "auto" : "none",
        transition: "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="group fixed bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex items-center gap-1.5 rounded-full bg-[#026E4E]/45 hover:bg-[#026E4E]/60 text-white px-3.5 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md cursor-pointer select-none"
    >
      <span className="tracking-tight">Cuộn xuống</span>
      <ArrowDown
        aria-hidden="true"
        size={13}
        className="text-white transition-transform duration-300 motion-safe:animate-bounce"
      />
    </button>
  );
}

export function CampaignContent({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <div className="relative h-screen h-svh">
          <ScrollDownButton />
        </div>
        {children}
      </main>
      {footer}
    </div>
  );
}

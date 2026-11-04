"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-white/80 hover:bg-white text-[#1F6B45] border border-white/90 shadow-[0_8px_30px_rgba(31,107,69,0.2)] backdrop-blur-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group animate-in fade-in zoom-in duration-300"
      aria-label="Cuộn về đầu trang"
      title="Về đầu trang"
    >
      <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-200" />
    </button>
  );
}

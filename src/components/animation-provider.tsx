"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
export function AnimationProvider() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 50, easing: "ease-out-cubic", disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => AOS.refresh();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return null;
}

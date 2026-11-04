"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
export function AnimationProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    AOS.init({ duration: 700, once: true, offset: 50, easing: "ease-out-cubic", disable: () => media.matches });
    // Mỗi lần vào trang (điều hướng client) phần tử mới được mount -> quét lại DOM để animation chạy mà không cần reload.
    const frame = requestAnimationFrame(() => AOS.refreshHard());
    const timer = window.setTimeout(() => AOS.refreshHard(), 250);
    const update = () => AOS.refresh();
    media.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      media.removeEventListener("change", update);
    };
  }, [pathname]);
  return null;
}

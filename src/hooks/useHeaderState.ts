"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { EXPAND_ON_SCROLL_UP, HEADER_COLLAPSE_Y, HEADER_EXPAND_Y } from "@/constants/config";

interface CloseOptions {
  /** false khi sắp mở modal khác, tránh giành focus của modal. */
  restoreFocus?: boolean;
}

/**
 * Trạng thái header: thu gọn theo scroll (hysteresis, chỉ setState khi vượt ngưỡng) và menu toàn màn hình.
 * `ready` chỉ bật sau lần đo đầu tiên để reload giữa trang không chạy animation co lại.
 */
export function useHeaderState() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const opener = useRef<HTMLElement | null>(null);

  // Đổi route thì tự đóng menu.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let isCollapsed = false;
    let lastY = window.scrollY;
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      const y = window.scrollY;
      let next = isCollapsed;
      if (!isCollapsed && y > HEADER_COLLAPSE_Y) next = true;
      else if (isCollapsed) {
        if (y < HEADER_EXPAND_Y) next = false;
        else if (EXPAND_ON_SCROLL_UP && y < lastY - 8) next = false;
      }
      lastY = y;
      if (next !== isCollapsed) {
        isCollapsed = next;
        setCollapsed(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    const readyFrame = requestAnimationFrame(() => setReady(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(readyFrame);
    };
  }, []);

  // Menu mở: khóa cuộn (kể cả Lenis), Esc để đóng.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const lenis = window.__lenis;
    const shouldResume = !!lenis && !lenis.isStopped;
    document.body.style.overflow = "hidden";
    if (shouldResume) lenis.stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (shouldResume) window.__lenis?.start();
      const target = opener.current;
      opener.current = null;
      if (target?.isConnected) requestAnimationFrame(() => target.focus({ preventScroll: true }));
    };
  }, [menuOpen]);

  const openMenu = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback((options?: CloseOptions) => {
    if (options?.restoreFocus === false) opener.current = null;
    setMenuOpen(false);
  }, []);

  return { collapsed, ready, menuOpen, openMenu, closeMenu };
}

/** Section đang nằm ở giữa viewport (để đánh dấu link active). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key.split("|").map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!elements.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

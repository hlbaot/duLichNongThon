"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FALLBACK_MS,
  INTRO_LOAD_GRACE_MS,
  INTRO_REVEAL_MS,
  INTRO_STORAGE_KEY,
  INTRO_VIDEO_MS,
  STAGGER_MS,
} from "@/constants/config";

export type IntroPhase = "video" | "reveal" | "done";

/** Sự kiện do BackgroundVideo phát ra để hook biết trạng thái video. */
export const INTRO_VIDEO_PLAYING = "intro:video-playing";
export const INTRO_VIDEO_LOADED = "intro:video-loaded";

const SKIP_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * Máy trạng thái video → reveal → done cho trang chủ.
 * Nguồn sự thật là thuộc tính `data-intro` trên <html>; CSS (src/styles/intro.css) chỉ cần đọc thuộc tính này.
 */
export function useIntroSequence() {
  const [phase, setPhase] = useState<IntroPhase>("video");
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--intro-stagger", `${STAGGER_MS}ms`);

    let played = false;
    try {
      played = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    } catch {
      /* sessionStorage không khả dụng: coi như đã chạy để không chặn người dùng. */
      played = true;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (next: IntroPhase) => {
      root.dataset.intro = next;
      setPhase(next);
    };

    if (played || reduced) {
      apply("done");
      return;
    }

    let current: IntroPhase = "video";
    let playTimer: number | undefined;
    let loadTimer: number | undefined;
    let revealTimer: number | undefined;

    apply("video");
    window.__lenis?.stop();

    const stopListening = () => {
      window.removeEventListener(INTRO_VIDEO_PLAYING, onPlaying);
      window.removeEventListener(INTRO_VIDEO_LOADED, onLoaded);
      SKIP_EVENTS.forEach((name) => window.removeEventListener(name, skip));
    };
    const clearVideoTimers = () => {
      window.clearTimeout(playTimer);
      window.clearTimeout(loadTimer);
      window.clearTimeout(fallbackTimer);
    };

    const toDone = () => {
      if (current === "done") return;
      current = "done";
      clearVideoTimers();
      window.clearTimeout(revealTimer);
      stopListening();
      apply("done");
      window.__lenis?.start();
    };

    const toReveal = () => {
      if (current !== "video") return;
      current = "reveal";
      clearVideoTimers();
      stopListening();
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        /* bỏ qua */
      }
      apply("reveal");
      revealTimer = window.setTimeout(toDone, INTRO_REVEAL_MS);
    };

    function skip() {
      if (current === "video") toReveal();
      else toDone();
    }
    skipRef.current = skip;

    function onPlaying() {
      if (current !== "video" || playTimer !== undefined) return;
      window.clearTimeout(loadTimer);
      // Đủ INTRO_VIDEO_MS tính từ lúc video thật sự phát (không tính từ lúc load trang).
      playTimer = window.setTimeout(toReveal, INTRO_VIDEO_MS);
    }
    function onLoaded() {
      if (current !== "video" || playTimer !== undefined) return;
      loadTimer = window.setTimeout(toReveal, INTRO_LOAD_GRACE_MS);
    }

    window.addEventListener(INTRO_VIDEO_PLAYING, onPlaying);
    window.addEventListener(INTRO_VIDEO_LOADED, onLoaded);
    SKIP_EVENTS.forEach((name) => window.addEventListener(name, skip, { passive: true }));
    // Timeout cứng: không bao giờ giữ người dùng quá FALLBACK_MS ở giai đoạn video.
    const fallbackTimer = window.setTimeout(toReveal, FALLBACK_MS);

    return () => {
      // Rời trang chủ (hoặc remount) giữa chừng: trả mọi thứ về trạng thái bình thường.
      clearVideoTimers();
      window.clearTimeout(revealTimer);
      stopListening();
      if (current !== "done") {
        current = "done";
        root.dataset.intro = "done";
        window.__lenis?.start();
      }
    };
  }, []);

  const skip = useCallback(() => skipRef.current(), []);
  return { phase, skip };
}

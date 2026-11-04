"use client";

import { useEffect, useRef } from "react";
import { CAMPAIGN_POSTER, VIMEO_EMBED_URL } from "@/lib/media";
import { videoManager } from "@/lib/video-manager";

const VIMEO_ORIGIN = new URL(VIMEO_EMBED_URL).origin;

export function BackgroundVideo() {
  const player = useRef<HTMLIFrameElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = player.current;
    if (!iframe) return;

    const send = (method: string, value?: string | number | boolean) => {
      iframe.contentWindow?.postMessage(JSON.stringify({ method, value }), VIMEO_ORIGIN);
    };
    const play = () => {
      if (document.visibilityState === "hidden") return;
      send("setVolume", 0);
      send("setLoop", true);
      send("setAutopause", false);
      send("play");
    };
    const ping = () => send("ping");
    const connect = () => {
      ping();
      play();
    };
    // Retry the handshake in case the iframe loaded before this effect subscribed.
    const readyTimer = window.setInterval(ping, 250);
    // Recover silent pauses without seeking or restarting a video already playing.
    const playbackTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") send("getPaused");
    }, 5000);

    const handleMessage = (message: MessageEvent) => {
      if (message.origin !== VIMEO_ORIGIN || message.source !== iframe.contentWindow) return;

      let data = message.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;

      if (data.event === "ready" || data.method === "ping") {
        window.clearInterval(readyTimer);
        for (const event of ["playing", "timeupdate", "pause", "ended"]) {
          send("addEventListener", event);
        }
        play();
        send("getPaused");
      }
      if (
        data.event === "playing" ||
        data.event === "timeupdate" ||
        (data.method === "getPaused" && data.value === false)
      ) {
        iframe.style.opacity = "1";
      }
      if (data.event === "pause" || (data.method === "getPaused" && data.value === true)) {
        play();
      }
      if (data.event === "ended") {
        send("setCurrentTime", 0);
        play();
      }
    };

    const unsubscribeVideoManager = videoManager.subscribe((activeId) => {
      if (activeId !== null) {
        send("pause");
      } else if (document.visibilityState === "visible") {
        send("play");
      }
    });

    window.addEventListener("message", handleMessage);
    iframe.addEventListener("load", connect);
    document.addEventListener("visibilitychange", play);
    window.addEventListener("focus", play);
    // Some browsers require a user interaction before allowing autoplay.
    window.addEventListener("pointerdown", play);
    window.addEventListener("keydown", play);
    connect();
    return () => {
      unsubscribeVideoManager();
      window.clearInterval(readyTimer);
      window.clearInterval(playbackTimer);
      iframe.removeEventListener("load", connect);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("visibilitychange", play);
      window.removeEventListener("focus", play);
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("keydown", play);
    };
  }, []);

  useEffect(() => {
    const shade = overlay.current;
    if (!shade) return;
    const copy = document.querySelector("#hero .hero-copy");

    const update = () => {
      // Keep the opening video clear; shade gently as the text enters the viewport.
      const top = copy?.getBoundingClientRect().top ?? window.innerHeight;
      const progress = window.scrollY <= 0 ? 0 : Math.min(1, Math.max(0,
        (window.innerHeight - top) / (window.innerHeight * 0.35)
      ));
      shade.style.opacity = String(progress * 0.28);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08291D] bg-cover bg-center"
      style={{ backgroundImage: `url("${CAMPAIGN_POSTER}")` }}
    >
      <iframe
        ref={player}
        src={VIMEO_EMBED_URL}
        loading="eager"
        title="Video giới thiệu du lịch nông thôn Việt Nam"
        allow="autoplay; fullscreen"
        tabIndex={-1}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0 opacity-0"
      />
      <div
        ref={overlay}
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

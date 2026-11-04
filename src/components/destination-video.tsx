"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getVideoEmbed } from "@/lib/video";
import type { DestinationVideoProps } from "@/types/destination-video";

const VIMEO_ORIGIN = "https://player.vimeo.com";
const formatTime = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

function VideoPreview({ src, title, poster }: DestinationVideoProps) {
  const embedData = getVideoEmbed(src, { preview: true });
  const iframe = useRef<HTMLIFrameElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const isDraggingRef = useRef(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const sendVimeo = (method: string, value?: number | boolean | string) => {
    iframe.current?.contentWindow?.postMessage(JSON.stringify({ method, value }), VIMEO_ORIGIN);
  };

  const sendYouTube = (func: string, args: unknown[] = []) => {
    iframe.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  useEffect(() => {
    const frame = iframe.current;
    const native = video.current;
    let subscribed = false;

    const play = () => {
      if (native) {
        native.muted = true;
        void native.play().catch(() => {});
      } else if (embedData?.type === "vimeo") {
        sendVimeo("setVolume", 0);
        sendVimeo("setLoop", true);
        sendVimeo("setAutopause", false);
        sendVimeo("play");
      } else if (embedData?.type === "youtube") {
        sendYouTube("mute");
        sendYouTube("playVideo");
      }
    };

    const connect = () => {
      if (embedData?.type === "vimeo") {
        sendVimeo("ping");
        sendVimeo("getDuration");
        sendVimeo("getCurrentTime");
      }
      play();
    };

    const onMessage = (message: MessageEvent) => {
      if (!frame || message.source !== frame.contentWindow) return;
      let payload = message.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      if (!payload || typeof payload !== "object") return;

      // Vimeo events
      if (message.origin === VIMEO_ORIGIN) {
        if (payload.event === "ready" || payload.method === "ping") {
          if (!subscribed) {
            subscribed = true;
            for (const event of ["loaded", "timeupdate", "durationchange", "pause", "ended"]) {
              sendVimeo("addEventListener", event);
            }
            sendVimeo("getDuration");
            sendVimeo("getCurrentTime");
            play();
          }
        }
        if (payload.event === "loaded") {
          sendVimeo("getDuration");
          sendVimeo("getCurrentTime");
          play();
        }
        if (payload.event === "timeupdate" || payload.event === "durationchange") {
          let dataObj = payload.data;
          if (typeof dataObj === "string") {
            try { dataObj = JSON.parse(dataObj); } catch {}
          }
          if (typeof dataObj?.duration === "number" && Number.isFinite(dataObj.duration)) {
            setDuration(Math.max(0, dataObj.duration));
          }
          const sec = typeof dataObj?.seconds === "number" ? dataObj.seconds
            : typeof payload.value?.seconds === "number" ? payload.value.seconds
            : typeof payload.value === "number" ? payload.value
            : null;
          if (sec !== null && Number.isFinite(sec) && !isDraggingRef.current) {
            setCurrentTime(Math.max(0, sec));
          }
        }
        if (payload.method === "getDuration" && typeof payload.value === "number" && Number.isFinite(payload.value)) {
          setDuration(Math.max(0, payload.value));
        }
        if (payload.method === "getCurrentTime") {
          const sec = typeof payload.value === "number"
            ? payload.value
            : typeof payload.data === "number"
              ? payload.data
              : typeof payload.data?.seconds === "number"
                ? payload.data.seconds
                : null;
          if (sec !== null && Number.isFinite(sec) && !isDraggingRef.current) {
            setCurrentTime(Math.max(0, sec));
          }
        }
        if (payload.event === "pause" || (payload.method === "getPaused" && payload.value === true)) play();
        if (payload.event === "ended") {
          sendVimeo("setCurrentTime", 0);
          play();
        }
      }

      // YouTube events
      if (payload.event === "infoDelivery" && payload.info) {
        if (typeof payload.info.duration === "number" && Number.isFinite(payload.info.duration)) {
          setDuration(Math.max(0, payload.info.duration));
        }
        if (typeof payload.info.currentTime === "number" && Number.isFinite(payload.info.currentTime) && !isDraggingRef.current) {
          setCurrentTime(Math.max(0, payload.info.currentTime));
        }
      }
    };

    const recover = () => {
      if (document.visibilityState === "visible") play();
    };

    window.addEventListener("message", onMessage);
    frame?.addEventListener("load", connect);
    native?.addEventListener("pause", play);
    document.addEventListener("visibilitychange", recover);
    window.addEventListener("focus", recover);
    window.addEventListener("pointerdown", recover);
    window.addEventListener("keydown", recover);

    // Polling định kỳ để cập nhật thời gian chạy chính xác ngay cả khi iframe không bắn continuous timeupdate
    const timePoll = window.setInterval(() => {
      if (document.visibilityState !== "visible" || isDraggingRef.current) return;
      if (embedData?.type === "vimeo") {
        sendVimeo("getCurrentTime");
        if (duration <= 0) sendVimeo("getDuration");
      } else if (embedData?.type === "youtube") {
        sendYouTube("getCurrentTime");
      }
    }, 400);

    const checkPausedTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (frame) {
        if (embedData?.type === "vimeo") {
          if (!subscribed) connect();
          else sendVimeo("getPaused");
        }
      } else if (native?.paused) {
        play();
      }
    }, 2500);

    connect();

    return () => {
      window.clearInterval(timePoll);
      window.clearInterval(checkPausedTimer);
      window.removeEventListener("message", onMessage);
      frame?.removeEventListener("load", connect);
      native?.removeEventListener("pause", play);
      document.removeEventListener("visibilitychange", recover);
      window.removeEventListener("focus", recover);
      window.removeEventListener("pointerdown", recover);
      window.removeEventListener("keydown", recover);
    };
  }, [embedData, src, duration]);

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (embedData?.type === "vimeo") {
      sendVimeo("setCurrentTime", seconds);
    } else if (embedData?.type === "youtube") {
      sendYouTube("seekTo", [seconds, true]);
    } else if (video.current) {
      video.current.currentTime = seconds;
    }
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="destination-video-preview pointer-events-none absolute inset-0 overflow-hidden bg-black"
      role="group"
      aria-label={title}
    >
      {embedData ? (
        <iframe
          ref={iframe}
          src={embedData.url}
          title={title}
          loading="eager"
          allow="autoplay"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <video
          ref={video}
          src={src}
          aria-label={title}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={event => event.preventDefault()}
          onLoadedMetadata={event => {
            const value = event.currentTarget.duration;
            if (Number.isFinite(value)) setDuration(value);
          }}
          onTimeUpdate={event => {
            if (!isDraggingRef.current) {
              setCurrentTime(event.currentTarget.currentTime);
            }
          }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Thanh tua riêng biệt bên dưới */}
      <div
        className="destination-video-seek pointer-events-auto"
        onClick={event => event.stopPropagation()}
        onMouseDown={event => event.stopPropagation()}
        onTouchStart={event => event.stopPropagation()}
      >
        <span aria-hidden="true">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={Math.min(currentTime, duration || 1)}
          disabled={duration <= 0}
          aria-label={`Tua video ${title}`}
          aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          onPointerDown={event => {
            event.stopPropagation();
            isDraggingRef.current = true;
          }}
          onPointerUp={event => {
            event.stopPropagation();
            isDraggingRef.current = false;
          }}
          onPointerCancel={() => {
            isDraggingRef.current = false;
          }}
          onChange={event => seek(Number(event.target.value))}
          style={{ "--seek-progress": `${progress}%` } as CSSProperties}
        />
        <span aria-hidden="true">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export function DestinationVideo({ src, title, poster, mode = "controls" }: DestinationVideoProps) {
  if (mode === "preview") return <VideoPreview key={src} src={src} title={title} poster={poster} />;
  const embedData = getVideoEmbed(src);
  if (embedData) {
    return (
      <iframe
        src={embedData.url}
        title={title}
        loading="eager"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }
  return (
    <video
      src={src}
      aria-label={title}
      poster={poster || undefined}
      controls
      playsInline
      loop
      preload="none"
      className="absolute inset-0 h-full w-full bg-black object-contain"
    />
  );
}


"use client";

import React, { useState, useEffect, useId, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, Loader2 } from "lucide-react";
import { videoManager } from "@/lib/video-manager";

export interface VimeoPlayerProps {
  src: string;
  title: string;
  poster?: string | null;
  priority?: boolean;
  className?: string;
  onPlay?: () => void;
  autoPlay?: boolean;
}

/** Tách video ID và privacy hash từ URL Vimeo */
function parseVimeoUrl(source: string): { videoId: string; hash: string | null } | null {
  try {
    const url = new URL(source);
    if (!["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
      return null;
    }
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    if (!match) return null;
    const videoId = match[1];
    const hash = url.searchParams.get("h") ?? match[2] ?? null;
    return { videoId, hash };
  } catch {
    return null;
  }
}

export function VimeoPlayer({
  src,
  title,
  poster,
  priority = false,
  className = "",
  onPlay,
  autoPlay = false,
}: VimeoPlayerProps) {
  const playerId = useId();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isIframeLoaded, setIsIframeLoaded] = useState(autoPlay);
  const [oembedThumbnail, setOembedThumbnail] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const parsed = parseVimeoUrl(src);

  // Lắng nghe chỉ cho 1 video chạy tại một thời điểm
  useEffect(() => {
    const unsubscribe = videoManager.subscribe((activeId) => {
      if (activeId !== playerId && isPlaying) {
        setIsPlaying(false);
        setIsIframeLoaded(false);
      }
    });
    return () => {
      unsubscribe();
      videoManager.stop(playerId);
    };
  }, [playerId, isPlaying]);

  // Lắng nghe thông điệp từ Vimeo player để ẩn poster ngay khi video thực sự bắt đầu phát
  useEffect(() => {
    if (!isPlaying || isIframeLoaded) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("vimeo.com")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "play" || data.event === "playing" || data.event === "timeupdate" || data.event === "ready") {
          setIsIframeLoaded(true);
        }
      } catch {
        // Bỏ qua lỗi parse
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isPlaying, isIframeLoaded]);

  // Fallback: tự động kích hoạt hiển thị iframe ngay, không để người dùng chờ lâu
  useEffect(() => {
    if (isPlaying && !isIframeLoaded) {
      const timer = setTimeout(() => {
        setIsIframeLoaded(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, isIframeLoaded]);

  // Lấy thumbnail từ Vimeo oEmbed nếu chưa có poster
  useEffect(() => {
    if (poster || !src || !src.includes("vimeo.com")) return;
    let isMounted = true;
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(src)}&width=960`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.thumbnail_url) {
            setOembedThumbnail(data.thumbnail_url);
          }
        }
      } catch {
        // Fallback im lặng
      }
    };
    fetchThumbnail();
    return () => {
      isMounted = false;
    };
  }, [src, poster]);

  const handleStartPlay = useCallback(() => {
    setIsPlaying(true);
    videoManager.play(playerId);
    onPlay?.();
  }, [playerId, onPlay]);

  if (!parsed) {
    return (
      <div className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-black/90 flex items-center justify-center text-white/70 text-sm ${className}`}>
        <span>Video không hợp lệ</span>
      </div>
    );
  }

  // Tối ưu các tham số Vimeo Player:
  // - autoplay=1: phát ngay lập tức
  // - muted=1 (nếu autoPlay): đảm bảo trình duyệt không chặn autoplay do chính sách âm thanh
  // - playsinline=1: phát nội tuyến trên Safari/iOS không bật popup native
  // - autopause=0: tránh xung đột pause
  // - transparent=0: render nền đen nhanh không cần alpha channel
  // - dnt=1: không tải các tracker thứ 3 của Vimeo, giảm thời gian tải iframe đáng kể
  const embedUrl = `https://player.vimeo.com/video/${parsed.videoId}?autoplay=1&dnt=1&playsinline=1&transparent=0&autopause=0&api=1${
    autoPlay ? "&muted=1" : ""
  }${parsed.hash ? `&h=${parsed.hash}` : ""}`;

  const currentPoster = poster || oembedThumbnail;
  const showPoster = !autoPlay && (!isPlaying || !isIframeLoaded);

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* Iframe Vimeo: Render khi bắt đầu phát với loading="eager" để tải ưu tiên cao nhất */}
      {isPlaying && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="eager"
          onLoad={() => {
            setIsIframeLoaded(true);
          }}
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {/* Lớp Poster phủ lên mượt mà (Crossfade):
          Che đi giai đoạn trống / màn hình đen / khựng của iframe Vimeo trong lúc nạp luồng stream.
          Khi video đã sẵn sàng, lớp này mờ dần (fade out) thay vì biến mất đột ngột. */}
      <div
        role={isPlaying ? undefined : "button"}
        tabIndex={isPlaying ? undefined : 0}
        onClick={isPlaying ? undefined : handleStartPlay}
        onKeyDown={
          isPlaying
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStartPlay();
                }
              }
        }
        aria-label={isPlaying ? undefined : `Phát video: ${title}`}
        className={`absolute inset-0 flex items-center justify-center select-none transition-opacity duration-700 ease-out z-10 ${
          showPoster ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${!isPlaying ? "group cursor-pointer" : "pointer-events-none"}`}
      >
        {currentPoster ? (
          <Image
            src={currentPoster}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 960px)"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2519] to-[#04120C]" />
        )}

        {/* Lớp phủ màu điện ảnh */}
        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

        {/* Nút Play hoặc Spinner lúc đang đệm */}
        {!isPlaying ? (
          <div className="relative z-10 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#1F6B45]/90 text-white shadow-2xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#026E4E] group-active:scale-95">
            <Play className="h-7 w-7 sm:h-9 sm:w-9 translate-x-0.5 fill-white" />
          </div>
        ) : (
          /* Khi đã bấm phát và iframe đang kết nối: Hiện loader thanh thoát trên ảnh poster */
          <div className="relative z-10 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-xl">
            <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-white" />
          </div>
        )}

        <span className="sr-only">Video: {title}</span>
      </div>
    </div>
  );
}

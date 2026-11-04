"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
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
  const [oembedThumbnail, setOembedThumbnail] = useState<string | null>(null);
  const parsed = parseVimeoUrl(src);

  // Lắng nghe chỉ cho 1 video chạy tại một thời điểm
  useEffect(() => {
    const unsubscribe = videoManager.subscribe((activeId) => {
      if (activeId !== playerId && isPlaying) {
        setIsPlaying(false);
      }
    });
    return () => {
      unsubscribe();
      // Unmount hoàn toàn iframe để giải phóng tài nguyên CPU/RAM
      videoManager.stop(playerId);
    };
  }, [playerId, isPlaying]);

  // Nếu không có poster truyền vào, tự động lấy thumbnail từ Vimeo oEmbed
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
        // Fallback im lặng nếu oEmbed lỗi
      }
    };
    fetchThumbnail();
    return () => {
      isMounted = false;
    };
  }, [src, poster]);

  const handleStartPlay = () => {
    setIsPlaying(true);
    videoManager.play(playerId);
    onPlay?.();
  };

  if (!parsed) {
    return (
      <div className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-black/90 flex items-center justify-center text-white/70 text-sm ${className}`}>
        <span>Video không hợp lệ</span>
      </div>
    );
  }

  // URL iframe Vimeo: chỉ tạo khi người dùng bấm play, có autoplay=1 và dnt=1
  const embedUrl = `https://player.vimeo.com/video/${parsed.videoId}?autoplay=1&dnt=1${autoPlay ? "&muted=1" : ""}${
    parsed.hash ? `&h=${parsed.hash}` : ""
  }`;

  const currentPoster = poster || oembedThumbnail;

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-black ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {isPlaying ? (
        /* Khi người dùng bấm Play: Render iframe đầy đủ thuộc tính */
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        /* Facade pattern: Hiện poster + nút Play SVG, chưa tải iframe */
        <div
          role="button"
          tabIndex={0}
          onClick={handleStartPlay}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStartPlay();
            }
          }}
          aria-label={`Phát video: ${title}`}
          className="group absolute inset-0 flex items-center justify-center cursor-pointer select-none"
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

          {/* Lớp phủ chuyển màu dịu mắt */}
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

          {/* Nút Play trung tâm hình tròn nổi bật */}
          <div className="relative z-10 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#1F6B45]/90 text-white shadow-2xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#026E4E] group-active:scale-95">
            <Play className="h-7 w-7 sm:h-9 sm:w-9 translate-x-0.5 fill-white" />
          </div>

          <span className="sr-only">Bấm để phát video {title}</span>
        </div>
      )}
    </div>
  );
}

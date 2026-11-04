"use client";

import Link from "next/link";
import { MapPin, CheckCircle2, Heart } from "lucide-react";
import { useVoting } from "@/context/voting-context";
import { useDestinationVideo } from "@/hooks/useDestinationVideo";
import { DestinationVideo } from "./destination-video";
import { DestinationImage } from "./destination-image";
import type { DestinationCardProps } from "@/types/destination-card";

export function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
  const { user, handleVoteClick } = useVoting();
  const isVoted = user?.votedIds.includes(destination.id);
  const videoUrl = useDestinationVideo(destination.slug);
  const detailUrl = `/diem-den/${encodeURIComponent(destination.slug)}`;
  const delay = `${Math.floor((index % 12) / 4) * 70 + (index % 4) * 35}ms`;

  return (
    <article className="destination-card" style={{ animationDelay: delay }}>
      <div className="destination-card-media relative">
        {/* Link xem chi tiết phủ toàn bộ ảnh/video (ngoại trừ thanh tua có stopPropagation) */}
        <Link
          href={detailUrl}
          prefetch={false}
          className="absolute inset-0 z-0 block cursor-pointer"
          aria-label={`Xem chi tiết ${destination.name}`}
        >
          <DestinationImage
            src={destination.imageUrl}
            alt={destination.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>

        {/* Video tự phát, tắt tiếng, lặp liên tục, ẩn toàn bộ điều khiển player & chỉ giữ thanh tua bên dưới */}
        {videoUrl && (
          <DestinationVideo
            mode="preview"
            src={videoUrl}
            title={`Video ${destination.name}`}
            poster={destination.imageUrl}
          />
        )}
      </div>

      <div className="destination-card-body">
        <div className="destination-card-info">
          <Link href={detailUrl} prefetch={false} className="block hover:text-[#026E4E]" title={destination.name}>
            <h3 className="destination-card-title">{destination.name}</h3>
          </Link>
          {destination.province && (
            <p className="destination-card-location">
              <MapPin size={14} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{destination.province}</span>
            </p>
          )}
        </div>
        <div className="destination-card-actions">
          <div className="shrink-0">
            <span className="block text-xs text-[#4B6354] whitespace-nowrap">Lượt bình chọn</span>
            <strong className="text-lg font-extrabold tabular-nums text-[#026E4E]">
              {destination.votes.toLocaleString("vi-VN")}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => handleVoteClick(destination)}
            disabled={isVoted}
            className={`vote-button shrink-0 px-3.5 py-2 text-sm font-bold whitespace-nowrap ${isVoted ? "is-voted" : ""}`}
            aria-label={`${isVoted ? "Đã bình chọn" : "Bình chọn cho"} ${destination.name}`}
          >
            {isVoted ? <CheckCircle2 size={16} /> : <Heart size={16} />}
            <span>{isVoted ? "Đã vote" : "Vote"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}


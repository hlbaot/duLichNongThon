"use client";

import React, { memo } from "react";
import Link from "next/link";
import { CheckCircle2, Heart } from "lucide-react";
import { useVoting } from "@/context/voting-context";
import { DestinationImage } from "./destination-image";
import type { DestinationCardProps } from "@/types/destination-card";

function DestinationCardInner({ destination, index = 0 }: DestinationCardProps) {
  const { user, handleVoteClick } = useVoting();
  const isVoted = user?.votedIds.includes(destination.id);
  const detailUrl = `/diem-den/${encodeURIComponent(destination.slug)}`;
  const cardTitle = `${destination.contestCode ? `#${destination.contestCode} | ` : ""}${destination.shortTitle ?? destination.name}`;
  const delay = `${Math.floor((index % 8) / 4) * 60 + (index % 4) * 30}ms`;

  return (
    <article className="destination-card" style={{ animationDelay: delay }}>
      <div className="destination-card-media relative">
        {/* Link mở trang chi tiết /diem-den/[id] */}
        <Link
          href={detailUrl}
          prefetch={false}
          className="absolute inset-0 z-10 w-full h-full block cursor-pointer"
          aria-label={`Xem chi tiết bài thi ${destination.name}`}
        >
          <DestinationImage
            src={destination.imageUrl}
            alt={destination.name}
            fill
            sizes="(min-width: 1440px) 326px, (min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>

      </div>

      <div className="destination-card-body">
        <div className="destination-card-info">
          <Link
            href={detailUrl}
            prefetch={false}
            className="block text-left"
            title={cardTitle}
          >
            <h3 className="destination-card-title">{cardTitle}</h3>
          </Link>
        </div>

        <div className="destination-card-actions">
          <div className="shrink-0">
            <span className="block text-[11px] font-medium text-[#8EB69B] uppercase tracking-wider whitespace-nowrap">
              Lượt bình chọn
            </span>
            <strong className="text-xl font-black tabular-nums text-[#FFB020] drop-shadow-xs">
              {destination.votes.toLocaleString("vi-VN")}
            </strong>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={detailUrl}
              prefetch={false}
              className="px-3 py-2 text-xs font-bold text-[#E2F7EB] bg-white/10 hover:bg-white/20 active:bg-white/15 rounded-xl border border-white/15 transition-all inline-flex items-center gap-1 shadow-xs cursor-pointer"
              title={`Xem bài dự thi ${destination.name}`}
            >
              <span>Chi tiết</span>
            </Link>

            <button
              type="button"
              onClick={() => handleVoteClick(destination)}
              disabled={isVoted}
              className={`vote-button shrink-0 px-3.5 py-2 text-xs font-bold whitespace-nowrap ${isVoted ? "is-voted" : ""}`}
              aria-label={`${isVoted ? "Đã bình chọn" : "Bình chọn cho"} ${destination.name}`}
            >
              {isVoted ? <CheckCircle2 size={15} /> : <Heart size={15} />}
              <span>{isVoted ? "Đã vote" : "Bình chọn"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export const DestinationCard = memo(DestinationCardInner);

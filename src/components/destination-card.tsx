"use client";
import type { DestinationCardProps } from "@/types/destination-card";

import React from "react";
import Link from "next/link";
import { DestinationImage } from "./destination-image";
import { useVoting } from "@/context/voting-context";
import { MapPin, CheckCircle2, Heart } from "lucide-react";


export function DestinationCard({ destination, rank, index = 0 }: DestinationCardProps) {
  const { user, handleVoteClick } = useVoting();
  const isVoted = user?.votedIds.includes(destination.id);

  // Tính toán lớp/hàng (Hàng 0, 1, 2 tương ứng 3 lớp của lưới 4x3)
  const layerIndex = Math.floor((index % 12) / 4);
  const colIndex = index % 4;
  const staggerDelay = `${layerIndex * 70 + colIndex * 35}ms`;

  const detailUrl = `/diem-den/${encodeURIComponent(destination.slug)}`;

  return (
    <div
      style={{ animationDelay: staggerDelay }}
      className="destination-card group rounded-2xl overflow-hidden bg-white border border-[#026E4E]/12 shadow-sm hover:shadow-xl hover:border-[#026E4E]/30 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5 animate-in fade-in-50 slide-in-from-bottom-4 duration-300 fill-mode-both"
    >
      {/* Top Image with Gradient Overlay - Clickable */}
      <Link
        href={detailUrl} prefetch={true}
        className="relative aspect-4/3 w-full overflow-hidden bg-[#EBF5EE] block cursor-pointer"
        aria-label={`Xem chi tiết điểm đến ${destination.name}`}
      >
        <DestinationImage
          region={destination.region}
          src={destination.imageUrl}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
            Hạng #{rank}
          </span>
          {destination.regionLabel && <span className="px-2 py-0.5 rounded-full bg-[#026E4E]/90 backdrop-blur-md text-[10px] font-semibold text-white">
            {destination.regionLabel}
          </span>}
        </div>

        {/* Name & Province over Photo */}
        <div className="absolute bottom-4 inset-x-5 text-white pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] text-[#00C2FF] font-medium mb-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{destination.province}</span>
          </div>
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-white group-hover:text-[#FFB020] transition-colors">
            {destination.name}
          </h3>
        </div>
      </Link>

      {/* Card Content & Action */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
        <Link
          href={detailUrl}
          className="text-sm text-[#4B6354] leading-relaxed line-clamp-2 block hover:text-[#0E382B] transition-colors"
        >
          {destination.brief}
        </Link>

        {/* Vote count and CTA Button */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
          <Link href={detailUrl} className="block group/vote">
            <span className="text-[10px] text-[#4B6354] block font-medium group-hover/vote:text-[#026E4E]">
              Bình chọn
            </span>
            <span
              key={destination.votes}
              className="text-sm sm:text-base font-extrabold text-[#026E4E] inline-block transition-transform duration-300 animate-in zoom-in-95"
            >
              {destination.votes.toLocaleString("vi-VN")}
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <Link
              href={detailUrl}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-[#026E4E] bg-[#E6F1E8]/70 hover:bg-[#E6F1E8] transition-colors cursor-pointer inline-flex items-center"
              title="Xem chi tiết điểm đến"
            >
              Chi tiết
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVoteClick(destination);
              }}
              disabled={isVoted}
              className={`vote-button px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer shrink-0 ${
                isVoted ? "is-voted" : ""
              }`}
            >
              {isVoted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#026E4E]" />
                  <span className="hidden sm:inline">Đã vote</span>
                </>
              ) : (
                <>
                  <Heart className="h-3.5 w-3.5 fill-white/80" />
                  <span>Vote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

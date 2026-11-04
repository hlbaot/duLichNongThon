"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Heart, MapPin, Trophy, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { useVoting } from "@/context/voting-context";
import { useVotingStore } from "@/stores/use-voting-store";
import type { GetDestinationResponse } from "@/types/api/destinations";
import type { Destination } from "@/types/voting-destination";

interface DestinationDetailClientProps {
  destination: GetDestinationResponse;
}

/** Chuyển đổi Markdown cơ bản sang các thẻ HTML an toàn */
function renderMarkdownContent(content: string) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = (key: number) => {
    if (paragraphBuffer.length === 0) return null;
    const text = paragraphBuffer.join(" ").trim();
    paragraphBuffer = [];
    if (!text) return null;

    // Format **bold** và *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
      <p key={`p-${key}`} className="text-base sm:text-lg leading-relaxed text-[#2C3E35]">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-extrabold text-[#0E382B]">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={i} className="italic text-[#1F6B45]">{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </p>
    );
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      const p = flushParagraph(index);
      if (p) elements.push(p);
      return;
    }

    if (line.startsWith("### ")) {
      const p = flushParagraph(index);
      if (p) elements.push(p);
      elements.push(
        <h3 key={`h3-${index}`} className="text-xl font-bold text-[#0E382B] mt-6 mb-2">
          {line.replace(/^###\s+/, "")}
        </h3>
      );
      return;
    }

    if (line.startsWith("## ")) {
      const p = flushParagraph(index);
      if (p) elements.push(p);
      elements.push(
        <h2 key={`h2-${index}`} className="text-2xl font-black text-[#0E382B] mt-8 mb-3 pb-2 border-b border-[#026E4E]/15">
          {line.replace(/^##\s+/, "")}
        </h2>
      );
      return;
    }

    if (line.startsWith("# ")) {
      const p = flushParagraph(index);
      if (p) elements.push(p);
      elements.push(
        <h1 key={`h1-${index}`} className="text-3xl font-black text-[#0E382B] mt-8 mb-4">
          {line.replace(/^#\s+/, "")}
        </h1>
      );
      return;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const p = flushParagraph(index);
      if (p) elements.push(p);
      elements.push(
        <li key={`li-${index}`} className="text-base sm:text-lg text-[#2C3E35] ml-6 list-disc mb-1.5">
          {line.replace(/^[-*]\s+/, "")}
        </li>
      );
      return;
    }

    paragraphBuffer.push(line);
  });

  const remaining = flushParagraph(lines.length);
  if (remaining) elements.push(remaining);

  return elements;
}

export function DestinationDetailClient({ destination }: DestinationDetailClientProps) {
  const { user, handleVoteClick } = useVoting();
  const ranking = useVotingStore((state) => state.ranking);

  // Tìm thông tin bình chọn và thứ hạng từ ranking store
  const rankedItem = useMemo(
    () => ranking.find((item) => item.id === destination.id || item.slug === destination.slug),
    [ranking, destination.id, destination.slug]
  );

  const votes = rankedItem?.votes ?? 0;
  const rank = rankedItem?.rank ?? null;
  const isVoted = user?.votedIds.includes(destination.id);

  const destinationObj: Destination = useMemo(
    () => ({
      id: destination.id,
      slug: destination.slug,
      code: destination.slug,
      name: destination.title,
      province: destination.province ?? "",
      brief: destination.brief,
      votes,
      displayOrder: destination.displayOrder,
      rank: rank ?? 999,
      imageUrl: destination.thumbnailUrl ?? "",
      regionLabel: "",
      tags: [],
    }),
    [destination, votes, rank]
  );

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: destination.title,
          text: destination.brief,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar: Back button + Live Vote status + Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#026E4E]/10">
        <Link
          href="/#destinations"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1F6B45] hover:text-[#0E382B] transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Danh sách điểm đến</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#026E4E]/20 text-[#1F6B45] hover:bg-[#F4FAF6] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Share2 size={14} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Hero Info Banner: Title, Province, Live Vote Stats, Vote Button */}
      <div className="rounded-3xl bg-gradient-to-br from-[#F4FAF6] via-white to-[#E8F5E9] p-6 sm:p-8 border border-[#026E4E]/15 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            {destination.province && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F6B45]/10 text-[#1F6B45] text-xs font-bold">
                <MapPin size={13} />
                <span>{destination.province}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl font-black text-[#0E382B] tracking-tight leading-tight">
              {destination.title}
            </h1>
            <p className="text-base sm:text-lg text-[#4B6354] leading-relaxed max-w-3xl">
              {destination.brief}
            </p>
          </div>

          {/* Voting Action Box */}
          <div className="shrink-0 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#026E4E]/15 shadow-xs flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-4 min-w-[200px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#4B6354]">Lượt bình chọn</span>
                <span className="text-2xl sm:text-3xl font-black text-[#026E4E] tabular-nums">
                  {votes.toLocaleString("vi-VN")}
                </span>
              </div>
              {rank && (
                <div className="text-right">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#4B6354]">Thứ hạng</span>
                  <div className="inline-flex items-center gap-1 text-lg font-black text-[#FF9F00]">
                    <Trophy size={16} />
                    <span>#{rank}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleVoteClick(destinationObj)}
              disabled={isVoted}
              className={`vote-button w-full justify-center px-6 py-3 text-base font-extrabold cursor-pointer ${
                isVoted ? "is-voted" : ""
              }`}
            >
              {isVoted ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Đã bình chọn</span>
                </>
              ) : (
                <>
                  <Heart size={18} />
                  <span>Bình chọn ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Markdown Content Section */}
      {destination.detail && (
        <article className="rounded-3xl bg-white p-6 sm:p-10 border border-[#026E4E]/10 shadow-xs space-y-4">
          <div className="prose-content space-y-3">
            {renderMarkdownContent(destination.detail)}
          </div>
        </article>
      )}
    </div>
  );
}

"use client";
import type { TopRankCardProps } from "@/types/top-rank-card";

import { useEffect, useRef, useState, memo, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";
import { Award, Check, Crown, Heart, Medal } from "lucide-react";
import { useVoting } from "@/context/voting-context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DestinationImage } from "./destination-image";

export const RANK_THEME = {
  1: {
    label: "DẪN ĐẦU BÌNH CHỌN", icon: Crown, order: 2, ink: "#5A4204", labelSurface: "#fff4cce6", voteInk: "#D97706", tint: "#fffdf5",
    header: "linear-gradient(135deg, #FFF4CC, #F59E0B 45%, #D97706 70%, #FFF4CC)",
    border: "linear-gradient(145deg, #FFFBEB, #FBBF24 30%, #B45309 60%, #F59E0B 82%, #FFFBEB)",
    glow: "0 0 0 1px rgba(245,158,11,.4), 0 20px 60px -10px rgba(245,158,11,.45), 0 0 80px rgba(254,243,199,.3)",
    badge: "linear-gradient(135deg, #78350F, #92400E 40%, #78350F 70%, #B45309)",
    entrance: "rank-enter-gold", duration: 900, shine: 900,
  },
  2: {
    label: "VỊ TRÍ THỨ HAI", icon: Award, order: 1, ink: "#0C4A6E", labelSurface: "#f0f9ffcc", voteInk: "#0284C7", tint: "#f5fbff",
    header: "linear-gradient(135deg, #e0f2fe, #38BDF8 40%, #0284C7 76%, #bae6fd)",
    border: "linear-gradient(145deg, #f0f9ff, #7DD3FC 40%, #0369A1 72%, #bae6fd)",
    glow: "0 14px 38px -15px rgba(2,132,199,.25)",
    badge: "linear-gradient(135deg, #075985, #0284C7, #075985)",
    entrance: "rank-enter-left", duration: 700, shine: 1800,
  },
  3: {
    label: "VỊ TRÍ THỨ BA", icon: Medal, order: 3, ink: "#14532D", labelSurface: "#f0fdf4cc", voteInk: "#16A34A", tint: "#f6fcf8",
    header: "linear-gradient(135deg, #dcfce7, #4ADE80 40%, #16A34A 76%, #bbf7d0)",
    border: "linear-gradient(145deg, #f0fdf4, #86EFAC 40%, #15803D 72%, #bbf7d0)",
    glow: "0 14px 38px -15px rgba(22,163,74,.24)",
    badge: "linear-gradient(135deg, #166534, #15803D, #166534)",
    entrance: "rank-enter-right", duration: 700, shine: 2000,
  },
} as const;

const SPARKLES = [
  { x: "8%", y: "15%", delay: 100 }, { x: "24%", y: "5%", delay: 800 },
  { x: "42%", y: "22%", delay: 1500 }, { x: "64%", y: "9%", delay: 400 },
  { x: "83%", y: "26%", delay: 1900 }, { x: "94%", y: "8%", delay: 1200 },
  { x: "73%", y: "45%", delay: 2400 },
] as const;
const BURST = [
  [-120,-65,30],[-96,-108,-35],[-67,-132,65],[-30,-100,-40],[5,-145,25],
  [40,-117,80],[77,-133,-25],[110,-87,55],[136,-30,100],[91,10,-50],
  [53,-48,35],[-57,-34,-60],[-143,-15,80],[-22,-155,110],
] as const;
function FourPointStar() { return <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0 10 6 16 8 10 10 8 16 6 10 0 8 6 6Z" /></svg>; }

function TopRankCardInner({ rank, destination, delay, play, order, tied = false }: TopRankCardProps) {
  const theme = RANK_THEME[rank];
  const Icon = theme.icon;
  const reduced = useReducedMotion();
  const canTilt = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [entering, setEntering] = useState(false);
  const [complete, setComplete] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const { user, handleVoteClick } = useVoting();
  const voted = !!user?.votedIds.includes(destination.id);
  const detailUrl = `/diem-den/${encodeURIComponent(destination.slug)}`;
  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), []);
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (rank !== 1 || !canTilt || reduced) return;
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    const x = Math.max(-4, Math.min(4, ((event.clientX - box.left) / box.width - .5) * 8));
    const y = Math.max(-4, Math.min(4, ((event.clientY - box.top) / box.height - .5) * -8));
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      element.style.setProperty("--tilt-x", `${y}deg`);
      element.style.setProperty("--tilt-y", `${x}deg`);
      element.dataset.tilting = "true";
    });
  };
  const resetTilt = () => {
    cancelAnimationFrame(pointerFrame.current);
    tilt.current?.style.removeProperty("--tilt-x");
    tilt.current?.style.removeProperty("--tilt-y");
    if (tilt.current) delete tilt.current.dataset.tilting;
  };
  const style = {
    "--rank-order": order ?? theme.order, "--rank-header": theme.header, "--rank-border": theme.border,
    "--rank-ink": theme.ink, "--rank-label-surface": theme.labelSurface, "--rank-vote-ink": theme.voteInk, "--rank-tint": theme.tint,
    "--rank-glow": theme.glow, "--rank-badge": theme.badge, "--rank-entrance": theme.entrance,
    "--rank-delay": `${delay}ms`, "--rank-mobile-delay": `${rank * 200}ms`,
    "--rank-duration": `${theme.duration}ms`, "--rank-shine-delay": `${theme.shine}ms`,
  } as CSSProperties;
  return <div className={`rank-slot rank-slot-${rank}`} style={style}>
    <div className={`rank-reveal ${play ? "rank-playing" : ""} ${entering ? "rank-entering" : ""} ${complete ? "rank-complete" : ""}`} onAnimationStart={event => { if (event.target === event.currentTarget) setEntering(true); }} onAnimationEnd={event => { if (event.target === event.currentTarget) { setEntering(false); setComplete(true); } }}>
      <div ref={tilt} className="rank-tilt" onPointerMove={onMove} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
        <div className="rank-glow" aria-hidden="true" />
        <article className="rank-frame" aria-label={`${tied ? "Đồng hạng" : "Hạng"} ${rank}: ${destination.name}`}>
          <div className="rank-surface">
            <Link href={detailUrl} prefetch={true} className="rank-visual cursor-pointer block" title={`Xem chi tiết bài thi ${destination.name}`}>
              <header className="rank-header"><span><Icon size={18} strokeWidth={1.8} />{tied ? `ĐỒNG HẠNG ${rank}` : theme.label}</span><span className="rank-badge-plate"><strong className="rank-badge">0{rank}</strong></span></header>
              <div className="rank-photo"><DestinationImage src={destination.imageUrl} alt={destination.name} region={destination.region} /><div className="rank-photo-shade" /><div className="rank-place">{destination.contestCode && <p>{destination.contestCode}</p>}<h3>{destination.shortTitle ?? destination.name}</h3></div></div>
              <div className="rank-shine" aria-hidden="true" />
              {rank === 1 && <div className="rank-sparkles" aria-hidden="true">{SPARKLES.map((sparkle, index) => <span key={index} style={{ left:sparkle.x, top:sparkle.y, "--sparkle-delay":`${sparkle.delay + 1000}ms` } as CSSProperties}><FourPointStar /></span>)}</div>}
            </Link>
            <div className="rank-body">
              <div className="rank-actions">
                <Link href={detailUrl} className="rank-vote-count cursor-pointer block">
                  <span>Lượt bình chọn</span>
                  <strong>{destination.votes.toLocaleString("vi-VN")}</strong>
                </Link>
                <button
                  className={`vote-button ${voted ? "is-voted" : ""}`}
                  disabled={voted}
                  onClick={() => handleVoteClick(destination)}
                >
                  {voted ? <Check size={16} /> : <Heart size={16} />}
                  {voted ? "Đã vote" : "Bình chọn"}
                </button>
              </div>
            </div>
          </div>
        </article>
        {rank === 1 && <div className="rank-burst" aria-hidden="true">{BURST.map(([x,y,rotation], index) => <span key={index} style={{ "--burst-x":`${x}px`, "--burst-y":`${y}px`, "--burst-turn":`${rotation}deg` } as CSSProperties}><FourPointStar /></span>)}</div>}
      </div>
    </div>
  </div>;
}

export const TopRankCard = memo(TopRankCardInner);

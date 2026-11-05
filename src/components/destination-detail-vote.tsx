"use client";

import { Check, Heart, LoaderCircle, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import { useVoting } from "@/context/voting-context";
import { useVotingStore } from "@/stores/use-voting-store";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "./ui/button";
import type { Destination } from "@/types/voting-destination";

export function DestinationDetailVote({
  destination,
  compact = false,
  rankingAvailable = true,
}: {
  destination: Destination;
  compact?: boolean;
  rankingAvailable?: boolean;
}) {
  const { user, handleVoteClick } = useVoting();
  const connected = useVotingStore(state => state.rankingConnected);
  const rankingLoading = useVotingStore(state => state.rankingLoading);
  const isVoting = useVotingStore((state) => state.isVoting);
  const { isLoading } = useAuth();
  const voted = !!user?.votedIds.includes(destination.id);
  const count = useCountUp(destination.votes, { start: true, duration: 850 });

  return (
    <div className={`profile-vote-card ${compact ? "profile-vote-compact" : ""}`}>
      {/* Header bar */}
      <div className="profile-vote-header">
        <div className="profile-vote-badge">
          <span className="profile-live-dot" />
          <span>BÌNH CHỌN CỘNG ĐỒNG</span>
        </div>
        <span className="profile-vote-status-tag">
          <Sparkles size={11} className="text-amber-500" />
          <span>{connected ? "Trực tiếp" : "Đang kết nối lại"}</span>
        </span>
      </div>

      {/* Stats container */}
      <div className="profile-vote-stat-box">
        <div className="profile-vote-stat-main">
          <span className="profile-vote-label">LƯỢT BÌNH CHỌN</span>
          <div className="profile-vote-count-row">
            <strong className="profile-vote-count" aria-label={rankingAvailable ? destination.votes.toLocaleString("vi-VN") : "Đang tải"}>
              {rankingAvailable ? count.toLocaleString("vi-VN") : rankingLoading ? "Đang tải…" : "Chưa có dữ liệu"}
            </strong>
            <span className="profile-vote-unit">phiếu</span>
          </div>
        </div>

        {rankingAvailable && destination.rank > 0 && destination.rank < 999 && (
          <div className="profile-vote-rank-pill">
            <Trophy size={13} className="text-amber-600 shrink-0" />
            <span>Hạng #{destination.rank}</span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <Button
        type="button"
        size="lg"
        className={`vote-button profile-vote-button ${voted ? "is-voted" : ""}`}
        disabled={voted || isVoting || isLoading}
        aria-busy={isVoting}
        onClick={() => handleVoteClick(destination)}
      >
        {isVoting || isLoading ? (
          <LoaderCircle size={18} className="profile-button-spinner" />
        ) : voted ? (
          <Check size={18} />
        ) : (
          <Heart size={18} className="fill-current" />
        )}
        <span>
          {isVoting ? "Đang xử lý…" : isLoading ? "Đang tải…" : voted ? "Đã vote" : "Bình chọn ngay"}
        </span>
        {voted && (
          <span className="profile-heart-particles" aria-hidden="true">
            <Heart size={14} />
            <Heart size={10} />
            <Heart size={12} />
          </span>
        )}
      </Button>

      {/* Trust & Note */}
      {!compact && (
        <div className="profile-vote-footer-note">
          <ShieldCheck size={15} className="shrink-0 text-emerald-600 mt-0.5" />
          <p>
            {voted
              ? "Lá phiếu của bạn đã được ghi nhận thành công."
              : user
              ? "Mỗi tài khoản chỉ được bình chọn 1 lần cho điểm đến này. Không giới hạn tổng số điểm đến."
              : "Đăng nhập nhanh để dành lá phiếu cho điểm đến bạn yêu mến."}
          </p>
        </div>
      )}
    </div>
  );
}

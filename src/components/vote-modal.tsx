"use client";

import React from "react";
import { DestinationImage } from "./destination-image";
import { useVoting } from "@/context/voting-context";
import { useVotingStore } from "@/stores/use-voting-store";
import { X, Heart, CheckCircle2 } from "lucide-react";

export function VoteModal() {
  const { voteModalDestination: selectedDestination, destinations, setVoteModalDestination, confirmVote, user, loginModalOpen } = useVoting();
  const voteModalDestination = destinations.find(destination => destination.id === selectedDestination?.id) ?? null;
  const isVoting = useVotingStore(state => state.isVoting);

  const panel = React.useRef<HTMLDivElement>(null);
  const isOpen = Boolean(voteModalDestination && !loginModalOpen && user);

  React.useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const lenis = window.__lenis;
    const resumeLenis = lenis && !lenis.isStopped;
    document.body.style.overflow = "hidden";
    if (resumeLenis) lenis.stop();
    panel.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      if (resumeLenis) lenis.start();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen || !voteModalDestination || !user) return null;

  const isVoted = user?.votedIds.includes(voteModalDestination.id);

  const handleConfirm = () => {
    void confirmVote(voteModalDestination.id);
  };

  return (
    <div
      className="modal-enter-overlay responsive-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/65 p-4 backdrop-blur-sm"
      onClick={event => {
        if (event.target === event.currentTarget) setVoteModalDestination(null);
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-modal-title"
        tabIndex={-1}
        data-lenis-prevent
        onKeyDown={event => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setVoteModalDestination(null);
          }
          if (event.key === "Tab") {
            const buttons = panel.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
            if (!buttons?.length) return;
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            const active = document.activeElement;
            if (active === panel.current || (event.shiftKey ? active === first : active === last)) {
              event.preventDefault();
              (event.shiftKey ? last : first).focus();
            }
          }
        }}
        className="modal-enter-panel responsive-modal-panel relative w-full max-w-md space-y-4 rounded-3xl border border-[#8EB69B] bg-linear-to-br from-[#F5FBF5] to-(--campaign-green) p-5 text-emerald-950 shadow-2xl shadow-emerald-950/40 outline-none sm:p-6"
      >
        <button
          type="button"
          onClick={() => setVoteModalDestination(null)}
          className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center text-red-700 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-red-700"
          aria-label="Đóng xác nhận bình chọn"
        >
          <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </button>

        <header className="flex items-center gap-3 pr-10">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-(--campaign-pine) text-lime-100 shadow-md shadow-emerald-900/20">
            <Heart aria-hidden="true" className="size-5 fill-current" />
          </span>
          <div>
            <p className="text-[11px] font-extrabold tracking-widest text-emerald-800 uppercase">Điểm đến yêu thích</p>
            <h3 id="vote-modal-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">Xác nhận bình chọn</h3>
          </div>
        </header>

        {/* Destination Card Preview */}
        <div className="overflow-hidden rounded-2xl border border-emerald-900/15 bg-[#F5FBF5] shadow-sm">
          <div className="relative aspect-video w-full">
            <DestinationImage
              region={voteModalDestination.region}
              src={voteModalDestination.imageUrl}
              alt={voteModalDestination.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] font-bold text-lime-200 uppercase tracking-wider">
                {voteModalDestination.code} • {voteModalDestination.province}
              </span>
              <h4 className="font-extrabold text-base leading-tight">
                {voteModalDestination.name}
              </h4>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1 px-4 py-3 text-xs font-semibold text-emerald-950">
            <span className="text-[#4B5E52]">Lượt bình chọn hiện tại:</span>
            <span className="text-[#1F6B45] font-black text-sm">
              {voteModalDestination.votes.toLocaleString("vi-VN")} lượt
            </span>
          </div>
        </div>

        {/* Notice */}
        {isVoted ? (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800 font-bold">
            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Bạn đã bình chọn cho điểm đến này rồi. Mỗi điểm đến chỉ được bình chọn 1 lần.</span>
          </div>
        ) : (
          <div className="space-y-1 rounded-2xl border border-emerald-900/15 bg-[#F5FBF5]/85 p-3.5">
            <p className="text-xs text-[#4B5E52]">
              Mỗi điểm đến chỉ được bình chọn <strong>1 lần</strong>. Lá phiếu sau khi xác nhận <strong>không thể thu hồi</strong>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setVoteModalDestination(null)}
            className="min-h-11 cursor-pointer rounded-xl border border-emerald-800/25 bg-white/60 px-4 text-sm font-bold text-emerald-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-emerald-800"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isVoting || isVoted}
            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--campaign-pine) px-3 text-sm font-extrabold text-white shadow-md shadow-emerald-900/20 hover:bg-(--campaign-deep) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Heart className="h-4 w-4 fill-current" />
            <span>{isVoting ? "Đang xác nhận…" : isVoted ? "Đã bình chọn" : "Xác nhận bình chọn"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

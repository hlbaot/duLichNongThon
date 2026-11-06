"use client";
import type { ActiveTab } from "@/types/rules-modal";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, CalendarDays, Check, Globe, Heart, Info, Mail, ShieldCheck, ThumbsUp, X } from "lucide-react";
import { useVoting } from "@/context/voting-context";
import { OfficialRulesArticles, PlatformVotingGuide, RulesAwards } from "./rules-content";

export function RulesModal() {
  const { rulesModalOpen, setRulesModalOpen } = useVoting();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!rulesModalOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.stop();
    }
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
      previousFocus?.focus();
    };
  }, [rulesModalOpen]);

  if (!rulesModalOpen) return null;
  const close = () => setRulesModalOpen(false);

  return (
    <div
      className="rules-overlay modal-enter-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div
        ref={panel}
        data-lenis-prevent
        className="rules-panel modal-enter-panel relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl border border-[#026E4E]/15 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-title"
      >
        {/* Modal Header */}
        <header className="px-6 py-5 bg-[#08291D] text-white flex items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative h-11 w-11 shrink-0 drop-shadow-sm">
              <Image
                src="/logo.png"
                alt="Logo Cuộc thi Du lịch Nông thôn"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold tracking-widest text-[#A7F3D0] uppercase">
                BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG • BAN TỔ CHỨC HỘI THI
              </span>
              <h2 id="rules-title" className="text-lg sm:text-xl font-black text-white truncate">
                Thể Lệ & Hướng Dẫn Bình Chọn Trực Tuyến 2026
              </h2>
            </div>
          </div>
          <button
            ref={closeButton}
            onClick={close}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Đóng thể lệ"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#F4FAF6] border-b border-[#026E4E]/10 overflow-x-auto text-xs font-bold scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#026E4E] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#0E382B] border border-[#026E4E]/10"
            }`}
          >
            Thể lệ chính thức (4 Điều)
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeTab === "guide" || activeTab === "steps"
                ? "bg-[#026E4E] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#0E382B] border border-[#026E4E]/10"
            }`}
          >
            Hướng dẫn 3 Nền tảng
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeTab === "awards"
                ? "bg-[#026E4E] text-white shadow-xs"
                : "bg-white text-[#4B6354] hover:text-[#0E382B] border border-[#026E4E]/10"
            }`}
          >
            Cơ cấu Giải thưởng
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#0E382B] text-sm leading-relaxed">
          {/* TAB 1: THỂ LỆ CHÍNH THỨC */}
          {(activeTab === "overview" || activeTab === "validity") && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Highlight summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 text-center">
                  <span className="block text-3xl font-black text-[#026E4E]">35</span>
                  <span className="text-xs font-bold text-[#0E382B] mt-1 block">Điểm đến</span>
                  <span className="text-[10px] text-[#4B6354]">Đề cử chính thức toàn quốc</span>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 text-center">
                  <span className="block text-3xl font-black text-[#026E4E]">03</span>
                  <span className="text-xs font-bold text-[#0E382B] mt-1 block">Nền tảng</span>
                  <span className="text-[10px] text-[#4B6354]">Facebook, TikTok, Web</span>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 text-center">
                  <span className="block text-3xl font-black text-[#026E4E]">1đ / vote</span>
                  <span className="text-xs font-bold text-[#0E382B] mt-1 block">Tính điểm</span>
                  <span className="text-[10px] text-[#4B6354]">1 Like = 1 Tim = 1 Vote</span>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-200/80 text-center">
                  <span className="block text-3xl font-black text-[#FF9F00]">14</span>
                  <span className="text-xs font-bold text-[#0E382B] mt-1 block">Ngày bình chọn</span>
                  <span className="text-[10px] text-[#4B6354]">07/11 đến 20/11/2026</span>
                </div>
              </div>

              {/* Contest Duration Card */}
              <div className="p-5 rounded-2xl bg-[#F8FCF9] border border-[#026E4E]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#026E4E]/10 flex items-center justify-center text-[#026E4E] shrink-0">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0E382B]">Thời gian bình chọn chính thức</h4>
                    <p className="text-xs text-[#4B6354]">Áp dụng đồng bộ trên toàn bộ 03 nền tảng chính thức</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-black bg-white px-4 py-2.5 rounded-xl border border-[#026E4E]/15 shadow-2xs">
                  <span className="text-[#026E4E]">00:00 · 07/11/2026</span>
                  <span className="text-[#4B6354]">đến</span>
                  <span className="text-[#FF9F00]">23:59 · 20/11/2026</span>
                </div>
              </div>

              {/* 4 Điều Thể lệ */}
              <OfficialRulesArticles />
            </div>
          )}

          {/* TAB 2: HƯỚNG DẪN 3 NỀN TẢNG */}
          {(activeTab === "guide" || activeTab === "steps") && (
            <div className="animate-in fade-in duration-150">
              <PlatformVotingGuide />
            </div>
          )}

          {/* TAB 3: GIẢI THƯỞNG */}
          {activeTab === "awards" && (
            <div className="animate-in fade-in duration-150">
              <RulesAwards />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-4 bg-[#F4FAF6] border-t border-[#026E4E]/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#4B6354]">
            <Mail className="h-4 w-4 text-[#026E4E]" />
            <span>Ban Thư ký Hội thi: <strong>Diemdendulichnongthonvietnam@gmail.com</strong></span>
          </div>
          <button
            onClick={close}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#026E4E] to-[#00875A] hover:from-[#01583E] hover:to-[#026E4E] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Đã hiểu thể lệ & quay lại
          </button>
        </footer>
      </div>
    </div>
  );
}

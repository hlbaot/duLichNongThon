"use client";

import { Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { VotingRules } from "./voting-rules";
import { PlatformVotingGuide } from "./rules-content";

export function HowToVote() {
  return (
    <section id="how-to-vote" aria-labelledby="how-heading" className="how-section">
      <div className="site-container relative">
        <header className="how-header mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <p className="campaign-info-label">BAN TỔ CHỨC HỘI THI 2026</p>
            <h2 id="how-heading" className="campaign-info-title">
              Hướng dẫn & Thể lệ bình chọn trực tuyến
            </h2>
            <p className="how-intro-copy">
              Bình chọn qua 03 nền tảng chính thức: Fanpage Facebook, TikTok và Cổng Landing Page. Không giới hạn tổng số lượt bình chọn.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="how-otp flex items-center gap-1.5 text-xs text-[#026E4E]">
              <Calendar className="h-4 w-4 text-[#FF9F00]" /> 00:00 07/11 – 23:59 20/11/2026
            </span>
            <span className="how-otp flex items-center gap-1.5 text-xs text-[#026E4E]">
              <CheckCircle2 className="h-4 w-4 text-[#026E4E]" /> Không giới hạn lượt bình chọn
            </span>
            <span className="how-otp flex items-center gap-1.5 text-xs text-[#026E4E]">
              <ShieldCheck className="h-4 w-4 text-[#026E4E]" /> Xác thực OTP Gmail an toàn
            </span>
          </div>
        </header>

        {/* Hướng dẫn 3 Nền tảng */}
        <PlatformVotingGuide inline />

        {/* 4 Điều Thể lệ và Giải thưởng */}
        <VotingRules />
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { Leaf, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VotingRules } from "./voting-rules";
import { PlatformVotingGuide } from "./rules-content";

export function HowToVote() {
  const { ref: sectionRef, inView: sectionInView } = useInView<HTMLElement>({ threshold: 0, once: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !sectionInView || reducedMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      element.style.setProperty("--leaf-drift", `${(0.5 - progress) * 100}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionRef, sectionInView, reducedMotion]);

  return (
    <section ref={sectionRef} id="how-to-vote" aria-labelledby="how-heading" className="how-section">
      <div className="how-ambient" aria-hidden="true">
        <i /><i /><i />
        <div className="how-leaves">
          <Leaf /><Leaf /><Leaf /><Leaf /><Leaf /><Leaf />
        </div>
      </div>

      <div className="site-container relative">
        <header className="how-header mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <p className="campaign-info-label">BAN TỔ CHỨC HỘI THI 2026</p>
            <h2 id="how-heading" className="campaign-info-title">
              <span className="campaign-info-emphasis">Hướng dẫn & Thể lệ</span> bình chọn trực tuyến
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

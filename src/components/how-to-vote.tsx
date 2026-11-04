"use client";

import { useEffect } from "react";
import { Leaf } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VotingRules } from "./voting-rules";
import { StepTimeline } from "./how-to-vote/step-timeline";

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
        <header className="how-header">
          <div>
            <p className="campaign-info-label">Hướng dẫn bình chọn</p>
            <h2 id="how-heading" className="campaign-info-title"><span className="campaign-info-emphasis">Quy trình</span> 5 bước bình chọn</h2>
            <p className="how-intro-copy">Mỗi tài khoản được bình chọn tối đa 03 điểm đến khác nhau</p>
          </div>
          <p className="how-otp">Xác thực OTP an toàn</p>
        </header>

        <StepTimeline />
        <VotingRules />
      </div>
    </section>
  );
}

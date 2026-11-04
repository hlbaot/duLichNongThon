"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Timer } from "lucide-react";
import { RevealOnScroll } from "./reveal-on-scroll";

export function Hero() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const endAt = process.env.NEXT_PUBLIC_VOTING_END_AT;
    if (!endAt || !Number.isFinite(Date.parse(endAt))) return;
    const tick = () =>
      setRemaining(
        Math.max(0, Date.parse(endAt) - Date.now())
      );
    tick();
    const timer = setInterval(tick, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const values =
    remaining === null
      ? [null, null, null, null]
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ];

  return (
    <section id="hero" className="campaign-hero">
      <div className="site-container hero-layout">
        <RevealOnScroll className="hero-copy">
          <h1 className="hero-stagger" style={{ "--i": 0 } as CSSProperties}>
            HỘI THI ĐIỂM ĐẾN DU LỊCH NÔNG THÔN<br />
            <em>TỐT NHẤT VIỆT NAM NĂM 2026</em>
          </h1>
          <p className="hero-description hero-stagger" style={{ "--i": 1 } as CSSProperties}>
            Hội thi được tổ chức nhằm tìm kiếm, giới thiệu và tôn vinh các điểm đến tiêu biểu, mang đậm bản sắc văn hóa, cảnh quan và những trải nghiệm đặc trưng của các vùng quê Việt Nam. Thông qua Hội thi, các giá trị du lịch nông thôn được quảng bá rộng rãi, góp phần bảo tồn bản sắc văn hóa, phát huy tiềm năng địa phương và thúc đẩy phát triển du lịch bền vững.
          </p>

          <div className="hero-actions hero-stagger" style={{ "--i": 2 } as CSSProperties}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("destinations");
                if (el) {
                  if (typeof window !== "undefined" && window.__lenis) {
                    window.__lenis.scrollTo(el, { offset: -70 });
                  } else {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="vote-button cursor-pointer"
            >
              Bình chọn ngay <ArrowUpRight size={19} />
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("how-to-vote");
                if (el) {
                  if (typeof window !== "undefined" && window.__lenis) {
                    window.__lenis.scrollTo(el, { offset: -70 });
                  } else {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="hero-text-link cursor-pointer"
            >
              Thể lệ bình chọn <ArrowDown size={16} />
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="hero-countdown">
          <p style={{ "--i": 3 } as CSSProperties} className="hero-stagger mb-4 flex items-center justify-center gap-2.5 text-center text-sm font-extrabold uppercase tracking-wider text-white sm:text-base">
            <Timer aria-hidden="true" className="size-5 shrink-0 text-[#FF9F00]" />
            {remaining === null ? "Lịch bình chọn đang cập nhật" : remaining === 0 ? "Bình chọn đã kết thúc" : "Thời gian bình chọn còn lại"}
          </p>

          <dl style={{ "--i": 4 } as CSSProperties} className="hero-stagger grid grid-cols-4 gap-1.5 sm:gap-2.5">
            {["Ngày", "Giờ", "Phút", "Giây"].map((label, index) => (
              <div key={label} className="flex min-w-0 flex-col items-center gap-2 px-1 py-2">
                <dt className="order-2 text-[10px] font-bold uppercase text-[#A7F3D0] sm:text-xs">{label}</dt>
                <dd className="font-mono text-[clamp(1.5rem,5vw,3rem)] leading-none font-black text-white tabular-nums">
                  {values[index] === null ? "--" : String(values[index]).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>
    </section>
  );
}

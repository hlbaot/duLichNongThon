"use client";

import { ArrowUpRight, Crown, Sparkles, Trophy } from "lucide-react";
import { useVotingStore } from "@/stores/use-voting-store";
import { useVoting } from "@/context/voting-context";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getTopDestinations } from "@/lib/rankings";
import { TopRankCard } from "./top-rank-card";

export function Top3Leaderboard() {
  const { setLeaderboardModalOpen } = useVoting();
  const topRankings = useVotingStore(state => state.topRankings);
  const connected = useVotingStore(state => state.rankingConnected);
  const loading = useVotingStore(state => state.rankingLoading);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: .2, once: true });
  const reduced = useReducedMotion();
  const top3 = getTopDestinations(topRankings);
  const play = inView || reduced;
  const classicPodium = top3.length === 3;

  return <section id="leaderboard" className={`ranking-section premium-ranking ${play ? "ranking-playing" : ""}`}>
    <div className="ranking-spotlight" aria-hidden="true" /><div className="ranking-halo" aria-hidden="true" />
    <div className="site-container">
      <div ref={ref} className="section-heading ranking-intro !justify-center text-center">
        <div className="mx-auto flex flex-col items-center text-center">
          <p className="eyebrow">BẢNG XẾP HẠNG · TOP 3</p>
          <h2>Những điểm đến<br /><em>được yêu thích nhất</em></h2>
        </div>
      </div>

      <p role="status" className="ranking-note">{loading ? "Đang tải bảng xếp hạng…" : connected ? "Đang cập nhật trực tiếp" : "Đang kết nối lại · Giữ dữ liệu cập nhật gần nhất"}</p>
      {loading ? <div className="premium-podium" aria-busy="true" aria-label="Đang tải bảng xếp hạng">
        {[1, 2, 3].map(item => <div key={item} className="h-72 rounded-3xl bg-white/30 animate-pulse" />)}
      </div> : top3.length ? <>
        <div className="premium-podium" data-count={top3.length}>
          {top3.map(({ destination, rank, tied }, index) => <TopRankCard
            key={destination.id}
            rank={rank}
            destination={destination}
            delay={index * 180}
            play={play}
            order={classicPodium ? [2, 1, 3][index] : index + 1}
            tied={tied}
          />)}
        </div>
        <div className="flex justify-center mt-8 sm:mt-10">
          <button className="text-link cursor-pointer text-sm sm:text-base font-bold inline-flex items-center gap-1.5" onClick={() => setLeaderboardModalOpen(true)}>
            <span>Xem toàn bộ bảng xếp hạng</span><ArrowUpRight size={18} />
          </button>
        </div>
        <p className="ranking-note">Hiển thị tối đa 3 điểm đến dẫn đầu theo thứ hạng chính thức từ hệ thống.</p>
      </> : <div className="ranking-empty" aria-busy={loading}>
        <div className="ranking-empty-art" aria-hidden="true">
          <div className="ranking-empty-orbit" />
          <Sparkles className="ranking-empty-sparkle" size={23} />
          <div className="ranking-empty-crown"><Crown size={34} strokeWidth={1.5} /></div>
          <div className="ranking-empty-steps">
            <div><span>02</span></div>
            <div><Trophy size={27} strokeWidth={1.5} /><span>01</span></div>
            <div><span>03</span></div>
          </div>
        </div>
        <div className="ranking-empty-copy">
          <span className="ranking-empty-status"><span />{loading ? "Đang cập nhật xếp hạng" : "Chờ những lá phiếu đầu tiên"}</span>
          <h3>Vị trí dẫn đầu<br />đang chờ bạn mở lối.</h3>
          <p>Mỗi lá phiếu là một lời yêu dành cho miền quê Việt. Hãy chọn điểm đến bạn yêu mến để khởi đầu bảng xếp hạng.</p>
          <a className="ranking-empty-cta" href="#destinations" onClick={event => {
            const target = document.getElementById("destinations");
            if (!target) return;
            event.preventDefault();
            if (window.__lenis) window.__lenis.scrollTo(target, { offset: -100 });
            else target.scrollIntoView({ behavior: "smooth" });
          }}>Khám phá &amp; bình chọn<ArrowUpRight size={18} /></a>
          <span className="ranking-empty-footnote">Tự động cập nhật khi có lượt bình chọn</span>
        </div>
      </div>}
    </div>
  </section>;
}

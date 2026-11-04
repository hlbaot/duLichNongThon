"use client";
import { ArrowUpRight } from "lucide-react";
import { useVotingStore } from "@/stores/use-voting-store";
import { useVoting } from "@/context/voting-context";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TopRankCard } from "./top-rank-card";
import type { TopRank } from "@/types/top-rank-card";

export function Top3Leaderboard() {
  const { setLeaderboardModalOpen } = useVoting();
  const ranking = useVotingStore(state => state.ranking);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: .35, once: true });
  const reduced = useReducedMotion();
  const top3 = ranking.slice(0, 3);
  const play = inView || reduced;
  if (!ranking.length) return null;

  return <section id="leaderboard" className={`ranking-section premium-ranking ${play ? "ranking-playing" : ""}`}>
    <div className="ranking-spotlight" aria-hidden="true" /><div className="ranking-halo" aria-hidden="true" />
    <div className="site-container">
      {/* A viewport-sized intro remains observable at 35% even when the mobile podium is taller than the viewport. */}
      {/* Header: Tối đa 2 tầng text gọn gàng */}
      <div ref={ref} className="section-heading ranking-intro">
        <div>
          <p className="eyebrow">BẢNG XẾP HẠNG · TOP 3</p>
          <h2>
            Những miền xanh<br />
            <em>được yêu mến nhất.</em>
          </h2>
        </div>
      </div>

      <div className="premium-podium">
        {top3.map((destination, index) => (
          <TopRankCard
            key={destination.id}
            rank={(index + 1) as TopRank}
            destination={destination}
            delay={[200, 1300, 1500][index]}
            play={play}
          />
        ))}
      </div>

      {/* Yêu cầu 10: Căn giữa để ở dưới phần rank */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <button
          className="text-link cursor-pointer text-sm sm:text-base font-bold inline-flex items-center gap-1.5"
          onClick={() => setLeaderboardModalOpen(true)}
        >
          <span>Xem toàn bộ bảng xếp hạng</span>
          <ArrowUpRight size={18} />
        </button>
      </div>

      <p className="ranking-note">
        Thứ hạng dựa trên tổng lượt bình chọn. Cùng số phiếu, thứ tự hiển thị do hệ thống xác định.
      </p>
    </div>
  </section>;
}

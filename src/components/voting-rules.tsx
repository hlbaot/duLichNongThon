import { OfficialRulesArticles, RulesAwards } from "./rules-content";

export function VotingRules() {
  return (
    <div className="mt-14 space-y-12 border-t border-emerald-900/20 pt-10 sm:mt-20 sm:space-y-16 sm:pt-12">
      {/* 4 Điều Thể lệ Bình chọn Trực tuyến */}
      <section aria-labelledby="official-rules-heading" data-aos="fade-up">
        <header className="mb-5 sm:mb-6">
          <p className="campaign-info-label">Quy chế chính thức</p>
          <h3 id="official-rules-heading" className="campaign-info-title">
            <span className="campaign-info-emphasis">Thể lệ</span> bình chọn trực tuyến
          </h3>
          <p className="text-xs sm:text-sm text-[#4B6354] mt-1">
            Ban hành kèm Thể lệ Hội thi “Điểm đến du lịch nông thôn Việt Nam tốt nhất” năm 2026
          </p>
        </header>
        <OfficialRulesArticles inline />
      </section>

      {/* Cơ cấu Giải thưởng */}
      <section aria-labelledby="voting-awards-heading" data-aos="fade-up">
        <header className="mb-5 sm:mb-6">
          <p className="campaign-info-label">Vinh danh & Trao giải</p>
          <h3 id="voting-awards-heading" className="campaign-info-title">
            <span className="campaign-info-emphasis">Giải thưởng</span> Hội thi 2026
          </h3>
        </header>
        <RulesAwards inline />
      </section>
    </div>
  );
}

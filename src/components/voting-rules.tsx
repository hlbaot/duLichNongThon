import { OfficialRulesArticles, RulesAwards } from "./rules-content";

export function VotingRules() {
  return (
    <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-16">
      {/* 4 Điều Thể lệ Bình chọn Trực tuyến */}
      <section aria-labelledby="official-rules-heading" className="voting-rules-summary" data-aos="fade-up">
        <header className="voting-rules-summary-heading">
          <h3 id="official-rules-heading" className="voting-rules-summary-title">
            Thể lệ bình chọn trực tuyến
          </h3>
        </header>
        <OfficialRulesArticles inline />
      </section>

      {/* Cơ cấu Giải thưởng */}
      <section aria-labelledby="voting-awards-heading" data-aos="fade-up">
        <header className="mb-5 sm:mb-6">
          <h3 id="voting-awards-heading" className="campaign-info-title">
            Giải thưởng Hội thi 2026
          </h3>
        </header>
        <RulesAwards inline />
      </section>
    </div>
  );
}

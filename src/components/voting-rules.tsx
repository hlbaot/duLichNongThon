import { OfficialRulesArticles, RulesAwards } from "./rules-content";

export function VotingRules() {
  return (
    <div className="mt-14 space-y-12 border-t border-emerald-900/20 pt-10 sm:mt-20 sm:space-y-16 sm:pt-12">
      {/* 4 Điều Thể lệ Bình chọn Trực tuyến */}
      <section aria-labelledby="official-rules-heading" className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-6" data-aos="fade-up">
        <header className="mb-4">
          <h3 id="official-rules-heading" className="text-lg font-bold text-neutral-900">
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

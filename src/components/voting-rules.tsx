import { RulesAwards, RulesValidity } from "./rules-content";

export function VotingRules() {
  return (
    <div className="mt-14 space-y-12 border-t border-emerald-900/20 pt-10 sm:mt-20 sm:space-y-16 sm:pt-12">
      <section aria-labelledby="voting-awards-heading">
        <header className="mb-5 sm:mb-6">
          <h3 id="voting-awards-heading" className="campaign-info-title"><span className="campaign-info-emphasis">Giải thưởng</span></h3>
        </header>
        <RulesAwards inline />
      </section>

      <section aria-labelledby="voting-validity-heading" data-aos="fade-up">
        <header className="mb-5 sm:mb-6">
          <h3 id="voting-validity-heading" className="campaign-info-title"><span className="campaign-info-emphasis">Tiêu chuẩn</span> bình chọn hợp lệ</h3>
        </header>
        <RulesValidity inline />
      </section>
    </div>
  );
}

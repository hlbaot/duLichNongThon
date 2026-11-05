import { BackgroundVideo } from "@/components/background-video";
import { CampaignContent } from "@/components/campaign-intro";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SectionDivider } from "@/components/section-divider";
import { AnimationProvider } from "@/components/animation-provider";
import { IntroSequence } from "@/components/intro-sequence";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Top3Leaderboard } from "@/components/top3";
import { DestinationGrid } from "@/components/destination-grid";
import { HowToVote } from "@/components/how-to-vote";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";

export default function HomeView() {
  return (
    <>
      <BackgroundVideo />
      <SmoothScroll />
      <AnimationProvider />
      <IntroSequence />
      <div className="relative isolate min-h-screen flex flex-col bg-transparent text-[#1B2B22]">
        <Navbar />
        <CampaignContent
          footer={
            <>
              <SectionDivider fill="var(--bg-deep)" className="divider-to-deep" />
              <Footer />
            </>
          }
        >
          <Hero
            startAt={process.env.VOTING_START_AT ?? process.env.NEXT_PUBLIC_VOTING_START_AT}
            endAt={process.env.VOTING_END_AT ?? process.env.NEXT_PUBLIC_VOTING_END_AT}
          />
          <SectionDivider fill="var(--campaign-green)" className="divider-to-sage" />
          <div className="campaign-green-flow">
            <Top3Leaderboard />
            <DestinationGrid />
            <HowToVote />
          </div>
        </CampaignContent>
        <BackToTop />
      </div>
    </>
  );
}

"use client";

import dynamic from "next/dynamic";

const LoginModal = dynamic(
  () => import("@/components/login-modal").then((m) => m.LoginModal),
  { ssr: false }
);

const VoteModal = dynamic(
  () => import("@/components/vote-modal").then((m) => m.VoteModal),
  { ssr: false }
);

const LeaderboardModal = dynamic(
  () => import("@/components/leaderboard-modal").then((m) => m.LeaderboardModal),
  { ssr: false }
);

const RulesModal = dynamic(
  () => import("@/components/rules-modal").then((m) => m.RulesModal),
  { ssr: false }
);

export function GlobalModals() {
  return (
    <>
      <LoginModal />
      <VoteModal />
      <LeaderboardModal />
      <RulesModal />
    </>
  );
}

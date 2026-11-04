"use client";
import type { VotingContextType } from "@/types/voting-context";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Destination } from "@/types/voting-destination";
import { useVotingStore } from "@/stores/use-voting-store";
import { AuthProvider, useAuth } from "@/lib/auth/AuthProvider";

const VotingContext = createContext<VotingContextType | null>(null);
function VotingBridge({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const ranking = useVotingStore(state => state.ranking);
  const destinations = ranking;
  const totalVotes = useVotingStore(state => state.totalVotes);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const user = auth.user ? { email: auth.user.email ?? "", votesRemaining: auth.remainingVotes, votedIds: auth.votedIds } : null;
  const waitingDestination = destinations.find(item => item.id === auth.pendingDestinationId);
  const voteModalDestination = selectedDestination ?? (auth.user && !auth.loginModalOpen ? waitingDestination ?? null : null);
  const setVoteModalDestination = (destination: Destination | null) => {
    auth.closeLoginModal();
    setSelectedDestination(destination);
  };
  const handleVoteClick = (destination: Destination) => {
    if (!auth.user || auth.hasVoted(destination.id) || auth.remainingVotes === 0) {
      void auth.vote(destination.id);
      return;
    }
    setVoteModalDestination(destination);
    setLeaderboardModalOpen(false);
  };
  const confirmVote = async (destinationId: string) => {
    const success = await auth.vote(destinationId);
    if (success) setVoteModalDestination(null);
    return success;
  };
  return <VotingContext.Provider value={{
    user, destinations, loginModalOpen: auth.loginModalOpen,
    setLoginModalOpen: open => { if (open) auth.openLoginModal(); else auth.closeLoginModal(); },
    voteModalDestination, setVoteModalDestination,
    leaderboardModalOpen, setLeaderboardModalOpen, rulesModalOpen, setRulesModalOpen,
    logoutUser: auth.logout,
    handleVoteClick, confirmVote, totalVotes,
  }}>{children}</VotingContext.Provider>;
}
export function VotingProvider({ children }: { children: ReactNode }) {
  return <AuthProvider><VotingBridge>{children}</VotingBridge></AuthProvider>;
}
export function useVoting() {
  const value = useContext(VotingContext);
  if (!value) throw new Error("useVoting phải được dùng bên trong VotingProvider.");
  return value;
}

"use client";

import { create } from "zustand";
import { getRankings, getTopRankings } from "@/api/rankings";
import { apiErrorMessage } from "@/api/errors";
import { toVotingDestination } from "@/data/destinations";
import type { VotingStore } from "@/types/voting-store";

let rankingSequence = 0;
let rankingRequest: Promise<void> | null = null;
let requestSequence = 0;

export const useVotingStore = create<VotingStore>((set) => ({
  user: null,
  myVotes: null,
  ranking: [],
  topRankings: [],
  totalVotes: 0,
  isVoting: false,
  rankingLoading: true,
  rankingError: null,
  applyRankings: (response) => set({
    ranking: response.items.map(toVotingDestination),
    topRankings: response.items.slice(0, 3).map(toVotingDestination),
    totalVotes: response.totalVotes,
    rankingLoading: false,
    rankingError: null,
  }),
  applyTopRankings: (response) => set({
    topRankings: response.items.map(toVotingDestination),
  }),
  refreshRankings: async () => {
    if (rankingRequest) {
      const pendingSequence = requestSequence;
      await rankingRequest;
      // A confirmed vote invalidates any request that started before it.
      if (pendingSequence !== rankingSequence) await useVotingStore.getState().refreshRankings();
      return;
    }
    const sequence = ++rankingSequence;
    requestSequence = sequence;
    rankingRequest = (async () => {
      try {
        const [topRes, allRes] = await Promise.all([
          getTopRankings().catch(() => null),
          getRankings(),
        ]);
        if (sequence === rankingSequence) {
          useVotingStore.getState().applyRankings(allRes);
          if (topRes) useVotingStore.getState().applyTopRankings(topRes);
        }
      } catch (error) {
        if (sequence === rankingSequence) set({ rankingError: apiErrorMessage(error), rankingLoading: false });
      }
    })();
    try { await rankingRequest; }
    finally { rankingRequest = null; }
  },
  applyConfirmedVote: (destinationId) => {
    // Discard polling responses that started before this confirmed vote.
    ++rankingSequence;
    set(state => {
      if (!state.ranking.some(item => item.id === destinationId)) return state;
      const ranking = state.ranking
        .map(item => item.id === destinationId ? { ...item, votes: item.votes + 1 } : item);
      const topRankings = state.topRankings.map(item => item.id === destinationId ? { ...item, votes: item.votes + 1 } : item);
      // Keep authoritative ranks until the immediate backend refresh completes.
      return { ranking, topRankings, totalVotes: state.totalVotes + 1 };
    });
  },
  setAccount: (user, myVotes) => set({ user, myVotes }),
  setIsVoting: (isVoting) => set({ isVoting }),
}));

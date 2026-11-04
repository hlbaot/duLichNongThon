"use client";

import { create } from "zustand";
import { getRankings, getTopRankings } from "@/api/rankings";
import { apiErrorMessage } from "@/api/errors";
import { toVotingDestination } from "@/data/destinations";
import type { VotingStore } from "@/types/voting-store";

let rankingSequence = 0;

export const useVotingStore = create<VotingStore>((set) => ({
  user: null,
  myVotes: null,
  ranking: [],
  topRankings: [],
  totalVotes: 0,
  isVoting: false,
  rankingLoading: true,
  rankingError: null,
  applyRankings: (response) => set((state) => ({
    ranking: response.items.map(toVotingDestination).sort((a, b) => a.rank - b.rank),
    topRankings: state.topRankings.length > 0 ? state.topRankings : response.items.slice(0, 3).map(toVotingDestination),
    totalVotes: response.totalVotes,
    rankingLoading: false,
    rankingError: null,
  })),
  applyTopRankings: (response) => set({
    topRankings: response.items.map(toVotingDestination).sort((a, b) => a.rank - b.rank),
  }),
  refreshRankings: async () => {
    const sequence = ++rankingSequence;
    try {
      const [topRes, allRes] = await Promise.all([
        getTopRankings().catch(() => null),
        getRankings(),
      ]);
      if (sequence === rankingSequence) {
        if (topRes) useVotingStore.getState().applyTopRankings(topRes);
        useVotingStore.getState().applyRankings(allRes);
      }
    } catch (error) {
      if (sequence === rankingSequence) set({ rankingError: apiErrorMessage(error), rankingLoading: false });
    }
  },
  applyConfirmedVote: (destinationId) => {
    // Discard polling responses that started before this confirmed vote.
    ++rankingSequence;
    set(state => {
      if (!state.ranking.some(item => item.id === destinationId)) return state;
      const ranking = state.ranking
        .map(item => item.id === destinationId ? { ...item, votes: item.votes + 1 } : item)
        .sort((a, b) => b.votes - a.votes || a.displayOrder - b.displayOrder || a.id.localeCompare(b.id))
        .map((item, index) => ({ ...item, rank: index + 1 }));
      return { ranking, totalVotes: state.totalVotes + 1 };
    });
  },
  setAccount: (user, myVotes) => set({ user, myVotes }),
  setIsVoting: (isVoting) => set({ isVoting }),
}));

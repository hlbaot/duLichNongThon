"use client";

import { create } from "zustand";
import { getRankingCounts, getRankings } from "@/api/rankings";
import { apiErrorMessage } from "@/api/errors";
import { toVotingDestination } from "@/data/destinations";
import { isRankingSnapshot } from "@/lib/ranking-stream";
import { mergeRankingCounts } from "@/lib/ranking-counts";
import type { GetRankingsResponse } from "@/types/api/rankings";
import type { VotingStore } from "@/types/voting-store";

let rankingRevision = 0;
let rankingRequest: { signal?: AbortSignal; promise: Promise<void> } | null = null;
let rankingSnapshot: GetRankingsResponse | null = null;

export const useVotingStore = create<VotingStore>((set) => ({
  user: null,
  myVotes: null,
  ranking: [],
  topRankings: [],
  totalVotes: 0,
  isVoting: false,
  rankingLoading: true,
  rankingConnected: false,
  rankingError: null,
  applyRankings: (response) => {
    ++rankingRevision;
    rankingSnapshot = response;
    const ranking = response.items.map(toVotingDestination);
    set({
      ranking,
      topRankings: ranking.slice(0, 3),
      totalVotes: response.totalVotes,
      rankingLoading: false,
      rankingError: null,
    });
  },
  applyRankingCounts: (counts) => {
    const snapshot = rankingSnapshot && mergeRankingCounts(rankingSnapshot, counts);
    if (!snapshot) return false;
    useVotingStore.getState().applyRankings(snapshot);
    return true;
  },
  refreshRankings: async (signal) => {
    if (rankingRequest && !rankingRequest.signal?.aborted) return rankingRequest.promise;
    const revision = rankingRevision;
    const request = { signal, promise: Promise.resolve() };
    request.promise = (async () => {
      try {
        // Metadata is loaded once; polling after initialization only reads counts.
        const counts = rankingSnapshot ? await getRankingCounts(signal) : null;
        if (signal?.aborted || revision !== rankingRevision) return;
        if (counts && useVotingStore.getState().applyRankingCounts(counts)) return;
        const snapshot = await getRankings(signal);
        // A newer SSE snapshot always wins over an older HTTP response.
        if (!signal?.aborted && revision === rankingRevision) {
          if (!isRankingSnapshot(snapshot)) throw new Error("Dữ liệu xếp hạng không hợp lệ.");
          useVotingStore.getState().applyRankings(snapshot);
        }
      } catch (error) {
        if (!signal?.aborted && revision === rankingRevision) set({ rankingError: apiErrorMessage(error) });
      } finally {
        if (rankingRequest === request) rankingRequest = null;
      }
    })();
    rankingRequest = request;
    return request.promise;
  },
  setAccount: (user, myVotes) => set({ user, myVotes }),
  setIsVoting: (isVoting) => set({ isVoting }),
}));

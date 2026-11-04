"use client";

import { useVotingStore } from "@/stores/use-voting-store";

/** Vote history from the backend, including destinations hidden after voting. */
export function useVoteHistory() {
  return useVotingStore(state => state.myVotes?.items);
}

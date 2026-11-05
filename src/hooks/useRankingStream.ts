"use client";

import { useEffect } from "react";
import { startRankingStream } from "@/lib/ranking-stream";
import { useVotingStore } from "@/stores/use-voting-store";

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export function useRankingStream() {
  useEffect(() => {
    if (!backendURL) {
      useVotingStore.setState({ rankingError: "Chưa cấu hình NEXT_PUBLIC_API_BASE_URL." });
      return;
    }
    return startRankingStream({
      url: `${backendURL}/rankings/stream`,
      applySnapshot: snapshot => useVotingStore.getState().applyRankings(snapshot),
      setConnected: rankingConnected => useVotingStore.setState({ rankingConnected }),
      refresh: signal => useVotingStore.getState().refreshRankings(signal),
    });
  }, []);
}

import type { DestinationSummary } from "./destinations";

export interface RankedDestination extends DestinationSummary {
  voteCount: number;
  rank: number;
}

export interface GetRankingsResponse {
  items: RankedDestination[];
  /** Totals include all active destinations, even for /rankings/top. */
  totalVotes: number;
  totalDestinations: number;
}

export type GetTopRankingsResponse = GetRankingsResponse;

export interface RankingCountsResponse {
  totalVotes: number;
  totalDestinations: number;
  items: { id: string; voteCount: number; rank: number }[];
}

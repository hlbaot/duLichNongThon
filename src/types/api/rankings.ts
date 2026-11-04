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

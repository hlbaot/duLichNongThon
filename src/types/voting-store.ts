import type { ApiUser } from "./api/auth";
import type { GetMyVotesResponse } from "./api/votes";
import type { GetRankingsResponse, RankingCountsResponse } from "./api/rankings";
import type { Destination } from "./voting-destination";

export interface VotingStore {
  user: ApiUser | null;
  myVotes: GetMyVotesResponse | null;
  ranking: Destination[];
  topRankings: Destination[];
  totalVotes: number;
  isVoting: boolean;
  rankingLoading: boolean;
  rankingConnected: boolean;
  rankingError: string | null;
  applyRankings(response: GetRankingsResponse): void;
  applyRankingCounts(response: RankingCountsResponse): boolean;
  refreshRankings(signal?: AbortSignal): Promise<void>;
  setAccount(user: ApiUser | null, myVotes: GetMyVotesResponse | null): void;
  setIsVoting(isVoting: boolean): void;
}

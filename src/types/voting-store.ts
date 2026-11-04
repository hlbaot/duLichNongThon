import type { ApiUser } from "./api/auth";
import type { GetMyVotesResponse } from "./api/votes";
import type { GetRankingsResponse, GetTopRankingsResponse } from "./api/rankings";
import type { Destination } from "./voting-destination";

export interface VotingStore {
  user: ApiUser | null;
  myVotes: GetMyVotesResponse | null;
  ranking: Destination[];
  topRankings: Destination[];
  totalVotes: number;
  isVoting: boolean;
  rankingLoading: boolean;
  rankingError: string | null;
  applyRankings(response: GetRankingsResponse): void;
  applyTopRankings(response: GetTopRankingsResponse): void;
  refreshRankings(): Promise<void>;
  applyConfirmedVote(destinationId: string): void;
  setAccount(user: ApiUser | null, myVotes: GetMyVotesResponse | null): void;
  setIsVoting(isVoting: boolean): void;
}

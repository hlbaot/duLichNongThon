import type { ISODateTime, UUID } from "./common";
import type { DestinationSummary } from "./destinations";

export interface CreateVoteRequest {
  destinationId: UUID;
}

export interface CreateVoteResponse {
  id: UUID;
  destinationId: UUID;
  createdAt: ISODateTime;
}

export interface MyVote extends CreateVoteResponse {
  destination: DestinationSummary;
}

export interface GetMyVotesResponse {
  items: MyVote[];
  usedVotes: number;
  remainingVotes: number;
  /** Limit for the entire contest, not a daily limit. */
  maxVotes: number;
}

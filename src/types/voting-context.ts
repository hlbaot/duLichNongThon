import type { Destination } from "./voting-destination";

export interface UserState { email: string; votesRemaining: number; votedIds: string[]; }

export interface VotingContextType {
  user: UserState | null;
  destinations: Destination[];
  loginModalOpen: boolean;
  setLoginModalOpen(open: boolean): void;
  voteModalDestination: Destination | null;
  setVoteModalDestination(destination: Destination | null): void;
  leaderboardModalOpen: boolean;
  setLeaderboardModalOpen(open: boolean): void;
  rulesModalOpen: boolean;
  setRulesModalOpen(open: boolean): void;
  logoutUser(): Promise<void>;
  confirmVote(destinationId: string): Promise<boolean>;
  handleVoteClick(destination: Destination): void;
  totalVotes: number;
}

import type { Destination } from "./voting-destination";

export type TopRank = 1 | 2 | 3;

export interface TopRankCardProps {
  rank: TopRank;
  destination: Destination;
  delay: number;
  play: boolean;
  order?: number;
  tied?: boolean;
}

export interface TopRankedDestination {
  destination: Destination;
  rank: TopRank;
  tied: boolean;
}

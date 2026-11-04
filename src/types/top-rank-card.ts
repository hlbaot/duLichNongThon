import type { Destination } from "./voting-destination";

export type TopRank = 1 | 2 | 3;

export interface TopRankCardProps { rank: TopRank; destination: Destination; delay: number; play: boolean; }

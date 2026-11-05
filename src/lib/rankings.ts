import type { Destination } from "@/types/voting-destination";
import type { TopRank, TopRankedDestination } from "@/types/top-rank-card";

/** Backend owns ranking order and resolves equal votes by displayOrder, then UUID. */
export function getTopDestinations(destinations: readonly Destination[]): TopRankedDestination[] {
  return destinations.slice(0, 3).filter(destination => destination.rank >= 1 && destination.rank <= 3).map(destination => ({
    destination,
    rank: destination.rank as TopRank,
    tied: false,
  }));
}

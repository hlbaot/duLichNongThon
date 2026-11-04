import type { Destination } from "@/types/voting-destination";
import type { TopRank, TopRankedDestination } from "@/types/top-rank-card";

/** Return top 3 destinations sorted by votes (and displayOrder as tiebreaker) so the podium always renders. */
export function getTopDestinations(destinations: readonly Destination[]): TopRankedDestination[] {
  const sorted = [...destinations].sort((a, b) =>
    b.votes - a.votes || a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));
  return sorted.slice(0, 3).map((destination, index) => ({
    destination,
    rank: (index + 1) as TopRank,
    tied: destination.votes > 0 && sorted.filter(item => item.votes === destination.votes).length > 1,
  }));
}

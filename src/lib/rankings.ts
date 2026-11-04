import type { Destination } from "@/types/voting-destination";
import type { TopRank, TopRankedDestination } from "@/types/top-rank-card";

/** Only destinations with votes enter the podium; ties never expand it beyond 3 cards. */
export function getTopDestinations(destinations: readonly Destination[]): TopRankedDestination[] {
  const voted = destinations.filter(item => item.votes > 0).sort((a, b) =>
    b.votes - a.votes || a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));
  return voted.slice(0, 3).map(destination => ({
    destination,
    rank: (voted.findIndex(item => item.votes === destination.votes) + 1) as TopRank,
    tied: voted.filter(item => item.votes === destination.votes).length > 1,
  }));
}

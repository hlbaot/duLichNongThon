import type { Destination } from "@/types/voting-destination";
import type { TopRank, TopRankedDestination } from "@/types/top-rank-card";

/**
 * Backend owns ranking order (equal votes resolved by displayOrder, then UUID) and picks which
 * destinations enter the top 3. For display, destinations with equal votes (> 0) share the same
 * rank (e.g. 1, 1, 3) and are flagged as tied so they get the same theme.
 */
export function getTopDestinations(destinations: readonly Destination[]): TopRankedDestination[] {
  const top = destinations.slice(0, 3).filter(destination => destination.rank >= 1 && destination.rank <= 3);
  return top.map((destination, index) => {
    const tied = destination.votes > 0 && top.filter(item => item.votes === destination.votes).length > 1;
    if (!tied) return { destination, rank: destination.rank as TopRank, tied: false };
    const firstSame = top.findIndex(item => item.votes === destination.votes);
    return { destination, rank: Math.min(firstSame >= 0 ? firstSame + 1 : index + 1, 3) as TopRank, tied: true };
  });
}

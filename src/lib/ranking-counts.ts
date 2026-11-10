import type { GetRankingsResponse, RankingCountsResponse } from "@/types/api/rankings";

export function isRankingCounts(value: unknown): value is RankingCountsResponse {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as RankingCountsResponse;
  if (!Number.isSafeInteger(snapshot.totalVotes) || snapshot.totalVotes < 0 ||
    !Number.isSafeInteger(snapshot.totalDestinations) || snapshot.totalDestinations < 0 ||
    !Array.isArray(snapshot.items) || snapshot.items.length !== snapshot.totalDestinations) return false;
  const ids = new Set<string>();
  const ranks = new Set<number>();
  let total = 0;
  for (const item of snapshot.items) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id) ||
      !Number.isSafeInteger(item.voteCount) || item.voteCount < 0 ||
      !Number.isSafeInteger(item.rank) || item.rank < 1 || item.rank > snapshot.totalDestinations || ranks.has(item.rank)) return false;
    ids.add(item.id);
    ranks.add(item.rank);
    total += item.voteCount;
  }
  return total === snapshot.totalVotes;
}

/** Counts are absolute, and all IDs must match before replacing any visible data. */
export function mergeRankingCounts(
  previous: GetRankingsResponse,
  counts: RankingCountsResponse,
): GetRankingsResponse | null {
  if (!isRankingCounts(counts) || previous.items.length !== counts.items.length) return null;
  const metadata = new Map(previous.items.map(item => [item.id, item]));
  if (metadata.size !== previous.items.length || counts.items.some(item => !metadata.has(item.id))) return null;
  return {
    totalVotes: counts.totalVotes,
    totalDestinations: counts.totalDestinations,
    items: counts.items.map(item => ({ ...metadata.get(item.id)!, ...item })).sort((a, b) => a.rank - b.rank),
  };
}

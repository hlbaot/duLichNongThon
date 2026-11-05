import type { RankedDestination } from "@/types/api/rankings";
import type { Destination } from "@/types/voting-destination";

export function toVotingDestination(destination: RankedDestination): Destination {
  return {
    id: destination.id,
    slug: destination.slug,
    contestCode: destination.contestCode ?? null,
    shortTitle: destination.shortTitle ?? destination.title,
    code: destination.contestCode ?? "",
    name: destination.title,
    province: destination.province ?? "",
    brief: destination.brief,
    votes: destination.voteCount,
    displayOrder: destination.displayOrder,
    rank: destination.rank,
    imageUrl: destination.thumbnailUrl ?? "",
    // Region metadata is not part of the API response.
    regionLabel: "",
    tags: [],
  };
}

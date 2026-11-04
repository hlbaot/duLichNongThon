import type { RankedDestination } from "@/types/api/rankings";
import type { Destination } from "@/types/voting-destination";

export function toVotingDestination(destination: RankedDestination): Destination {
  return {
    id: destination.id,
    slug: destination.slug,
    code: destination.slug,
    name: destination.title,
    province: destination.province ?? "",
    brief: destination.brief,
    votes: destination.voteCount,
    displayOrder: destination.displayOrder,
    rank: destination.rank,
    imageUrl: destination.thumbnailUrl ?? "",
    // The API does not expose a region or nomination code.
    regionLabel: "",
    tags: [],
  };
}

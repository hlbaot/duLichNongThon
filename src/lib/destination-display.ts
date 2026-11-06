import { OFFICIAL_DESTINATIONS } from "@/data/official-destinations";
import type { DestinationSummary, GetDestinationResponse } from "@/types/api/destinations";

const officialById = new Map<string, (typeof OFFICIAL_DESTINATIONS)[number]>(
  OFFICIAL_DESTINATIONS.map(entry => [entry.id, entry]),
);

/** One display identity for cards, rankings, metadata and detail pages. */
export function withOfficialDestination<T extends DestinationSummary>(destination: T): T {
  const official = officialById.get(destination.id);
  if (!official) return destination;
  return {
    ...destination,
    contestCode: official.code,
    shortTitle: official.title,
    title: official.title,
    province: official.province,
  };
}

export function withOfficialDestinationDetail(destination: GetDestinationResponse): GetDestinationResponse {
  const official = officialById.get(destination.id);
  if (!official) return destination;
  // Replace only this entry's legacy code; preserve article text and other codes.
  const replaceCode = (text: string) => text.replace(/\bDLNT(?:2026-)?0*(\d{1,3})\b/g,
    (code, number: string) => Number(number) === official.number ? official.code : code);
  return {
    ...withOfficialDestination(destination),
    detail: replaceCode(destination.detail),
    media: destination.media.map(media => ({
      ...media,
      caption: media.caption === null ? null : replaceCode(media.caption),
    })),
  };
}

import { https } from "./https";
import type { GetRankingsResponse, GetTopRankingsResponse } from "@/types/api/rankings";

export async function getTopRankings(): Promise<GetTopRankingsResponse> {
  const { data } = await https.get<GetTopRankingsResponse | null | "">("/rankings/top", {
    headers: { "Cache-Control": "no-store" },
  });
  return data || { items: [], totalVotes: 0, totalDestinations: 0 };
}

export async function getRankings(): Promise<GetRankingsResponse> {
  const { data } = await https.get<GetRankingsResponse | null | "">("/rankings", {
    headers: { "Cache-Control": "no-store" },
  });
  return data || { items: [], totalVotes: 0, totalDestinations: 0 };
}
